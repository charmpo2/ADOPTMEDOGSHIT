import { PetValue, AggregatedValue, Confidence, ValueCurrency } from '@/types';

// Calculate the average of an array of numbers
function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

// Calculate the median of an array of numbers
function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
}

// Calculate trimmed mean (removes outliers)
function calculateTrimmedMean(values: number[], trimPercentage: number = 0.2): number {
  if (values.length === 0) return 0;
  if (values.length <= 2) return calculateAverage(values);
  
  const sorted = [...values].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * trimPercentage);
  
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  return calculateAverage(trimmed);
}

// Calculate confidence score based on source agreement
function calculateConfidence(values: number[], sourceCount: number): Confidence {
  if (sourceCount === 0) return 'low';
  if (sourceCount === 1) return 'low';
  
  const avg = calculateAverage(values);
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  // Calculate coefficient of variation
  const range = max - min;
  const cv = avg > 0 ? (range / avg) * 100 : 100;
  
  // Confidence based on source count and value variance
  if (sourceCount >= 3 && cv < 20) {
    return 'high';
  } else if (sourceCount >= 2 && cv < 40) {
    return 'medium';
  }
  
  return 'low';
}

// Group values by pet name and variant
function groupPetValues(values: PetValue[]): Map<string, PetValue[]> {
  const grouped = new Map<string, PetValue[]>();
  
  values.forEach(value => {
    const key = `${value.petName.toLowerCase()}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(value);
  });
  
  return grouped;
}

// Aggregate values for a single pet
export function aggregatePetValues(petValues: PetValue[]): AggregatedValue {
  if (petValues.length === 0) {
    return {
      petName: '',
      averageValue: 0,
      minValue: 0,
      maxValue: 0,
      currency: 'cookies',
      sources: [],
      confidence: 'low',
      lastUpdated: new Date(),
    };
  }
  
  const petName = petValues[0].petName;
  const currency = petValues[0].currency;
  const numericValues = petValues.map(v => v.value);
  
  const averageValue = calculateAverage(numericValues);
  const minValue = Math.min(...numericValues);
  const maxValue = Math.max(...numericValues);
  const confidence = calculateConfidence(numericValues, petValues.length);
  
  // Get the most recent timestamp
  const lastUpdated = new Date(
    Math.max(...petValues.map(v => v.timestamp.getTime()))
  );
  
  return {
    petName,
    averageValue,
    minValue,
    maxValue,
    currency,
    sources: petValues,
    confidence,
    lastUpdated,
  };
}

// Aggregate all pet values
export function aggregateAllPetValues(values: PetValue[]): AggregatedValue[] {
  const grouped = groupPetValues(values);
  const aggregatedValues: AggregatedValue[] = [];
  
  grouped.forEach((petValues, petName) => {
    const aggregated = aggregatePetValues(petValues);
    aggregatedValues.push(aggregated);
  });
  
  return aggregatedValues.sort((a, b) => 
    a.petName.localeCompare(b.petName)
  );
}

// Get value range percentage
export function getValueRangePercentage(aggregatedValue: AggregatedValue): number {
  if (aggregatedValue.averageValue === 0) return 0;
  
  const range = aggregatedValue.maxValue - aggregatedValue.minValue;
  return (range / aggregatedValue.averageValue) * 100;
}

// Format value for display
export function formatValue(value: number, currency: ValueCurrency): string {
  if (currency === 'cookies') {
    return `${value.toLocaleString()} Cookies`;
  } else if (currency === 'shark') {
    return `${value.toLocaleString()} Shark`;
  } else if (currency === 'frost') {
    return `${value.toLocaleString()} Frost`;
  }
  
  return value.toLocaleString();
}

// Get confidence color for UI
export function getConfidenceColor(confidence: Confidence): string {
  switch (confidence) {
    case 'high':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Get confidence label
export function getConfidenceLabel(confidence: Confidence): string {
  switch (confidence) {
    case 'high':
      return 'High Confidence';
    case 'medium':
      return 'Medium Confidence';
    case 'low':
      return 'Low Confidence';
    default:
      return 'Unknown';
  }
}

// Calculate if a trade is fair
export function calculateTradeFairness(
  yourValue: number,
  theirValue: number,
  threshold: number = 10
): { result: 'win' | 'fair' | 'lose'; percentage: number; difference: number } {
  if (yourValue === 0 && theirValue === 0) {
    return { result: 'fair', percentage: 0, difference: 0 };
  }
  
  const difference = yourValue - theirValue;
  const percentage = theirValue > 0 
    ? (Math.abs(difference) / theirValue) * 100 
    : 100;
  
  if (percentage <= threshold) {
    return { result: 'fair', percentage, difference };
  } else if (yourValue > theirValue) {
    return { result: 'win', percentage, difference };
  } else {
    return { result: 'lose', percentage, difference };
  }
}
