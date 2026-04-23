import { AggregatedValue, Confidence, SourceValue, Variant, ValueSource } from '@/types';

/**
 * Calculate aggregated value from multiple sources using median-based aggregation
 * This resists outlier manipulation by prioritizing the median value
 */
export function calculateAggregatedValue(
  petId: string,
  sources: SourceValue[],
  variant: Variant = 'normal'
): AggregatedValue {
  if (sources.length === 0) {
    throw new Error(`No source values found for pet ${petId}`);
  }

  // Extract values for the requested variant
  const values = sources.map(s => {
    switch (variant) {
      case 'neon': return s.neon;
      case 'mega': return s.mega;
      default: return s.normal;
    }
  }).sort((a, b) => a - b);

  // Calculate median (middle value)
  const median = values.length % 2 === 0
    ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
    : values[Math.floor(values.length / 2)];

  // Calculate trimmed mean (exclude highest and lowest)
  let trimmedMean: number;
  if (values.length > 2) {
    const trimmed = values.slice(1, -1); // Remove first (min) and last (max)
    trimmedMean = trimmed.reduce((sum, val) => sum + val, 0) / trimmed.length;
  } else {
    trimmedMean = median;
  }

  // Final community value: weighted blend (70% median, 30% trimmed mean)
  const communityValue = Math.round(median * 0.7 + trimmedMean * 0.3);

  // Calculate confidence based on variance
  const min = Math.min(...values);
  const max = Math.max(...values);
  const variance = max - min;
  const variancePercent = variance / communityValue;

  let confidence: Confidence;
  if (variancePercent < 0.1) {
    confidence = 'high';
  } else if (variancePercent < 0.25) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Map source names to values
  const sourceMap: Record<ValueSource, number> = {
    elvebredd: 0,
    ggvalues: 0,
    amtv: 0,
  };

  sources.forEach((s, index) => {
    const val = variant === 'neon' ? s.neon : variant === 'mega' ? s.mega : s.normal;
    sourceMap[s.source] = val;
  });

  return {
    petId,
    variant,
    communityValue,
    median: Math.round(median),
    trimmedMean: Math.round(trimmedMean),
    min,
    max,
    confidence,
    sources: sourceMap,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculate values for all variants (normal, neon, mega)
 */
export function calculateAllVariants(
  petId: string,
  sources: SourceValue[]
): Record<Variant, AggregatedValue> {
  return {
    normal: calculateAggregatedValue(petId, sources, 'normal'),
    neon: calculateAggregatedValue(petId, sources, 'neon'),
    mega: calculateAggregatedValue(petId, sources, 'mega'),
  };
}

/**
 * Format value for display
 */
export function formatValue(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
}

/**
 * Get confidence color for UI
 */
export function getConfidenceColor(confidence: Confidence): string {
  switch (confidence) {
    case 'high': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-orange-500';
  }
}

/**
 * Get confidence label
 */
export function getConfidenceLabel(confidence: Confidence): string {
  switch (confidence) {
    case 'high': return 'High Confidence';
    case 'medium': return 'Medium Confidence';
    case 'low': return 'Low Confidence';
  }
}

/**
 * Calculate total inventory value
 */
export function calculateInventoryTotal(
  items: { petId: string; variant: Variant; quantity: number }[],
  getValue: (petId: string, variant: Variant) => number
): number {
  return items.reduce((total, item) => {
    const value = getValue(item.petId, item.variant);
    return total + value * item.quantity;
  }, 0);
}
