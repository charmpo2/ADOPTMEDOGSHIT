import { PetValue, ValueSource, ValueCurrency } from '@/types';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests per source
const REQUEST_TIMEOUT = 10000; // 10 second timeout

// Helper function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Adopt Me True Values Fetcher
export async function fetchFromAdoptMeTrueValues(): Promise<PetValue[]> {
  try {
    // Note: This is a placeholder implementation
    // In production, you would need to either:
    // 1. Use their official API if available
    // 2. Scrape their website (respecting robots.txt)
    // 3. Use a third-party API service
    
    // For now, returning mock data structure
    const mockData: PetValue[] = [
      {
        petName: 'Shadow Dragon',
        source: 'adoptmetruevalues',
        value: 45000,
        currency: 'cookies',
        timestamp: new Date(),
      },
      {
        petName: 'Bat Dragon',
        source: 'adoptmetruevalues',
        value: 25000,
        currency: 'cookies',
        timestamp: new Date(),
      },
      {
        petName: 'Giraffe',
        source: 'adoptmetruevalues',
        value: 20000,
        currency: 'cookies',
        timestamp: new Date(),
      },
    ];

    await delay(RATE_LIMIT_DELAY);
    return mockData;
  } catch (error) {
    console.error('Error fetching from Adopt Me True Values:', error);
    return [];
  }
}

// Adopt From Me Fetcher
export async function fetchFromAdoptFromMe(): Promise<PetValue[]> {
  try {
    // Note: This is a placeholder implementation
    // In production, you would need to either:
    // 1. Use their official API if available
    // 2. Scrape their website (respecting robots.txt)
    // 3. Use a third-party API service
    
    const mockData: PetValue[] = [
      {
        petName: 'Shadow Dragon',
        source: 'adoptfromme',
        value: 43000,
        currency: 'cookies',
        timestamp: new Date(),
      },
      {
        petName: 'Bat Dragon',
        source: 'adoptfromme',
        value: 24000,
        currency: 'cookies',
        timestamp: new Date(),
      },
      {
        petName: 'Giraffe',
        source: 'adoptfromme',
        value: 19000,
        currency: 'cookies',
        timestamp: new Date(),
      },
    ];

    await delay(RATE_LIMIT_DELAY);
    return mockData;
  } catch (error) {
    console.error('Error fetching from Adopt From Me:', error);
    return [];
  }
}

// Elvebredd Fetcher
export async function fetchFromElvebredd(): Promise<PetValue[]> {
  try {
    // Note: This is a placeholder implementation
    // In production, you would need to either:
    // 1. Use their official API if available
    // 2. Scrape their website (respecting robots.txt)
    // 3. Use a third-party API service
    
    const mockData: PetValue[] = [
      {
        petName: 'Shadow Dragon',
        source: 'elvebredd',
        value: 47000,
        currency: 'cookies',
        timestamp: new Date(),
      },
      {
        petName: 'Bat Dragon',
        source: 'elvebredd',
        value: 26000,
        currency: 'cookies',
        timestamp: new Date(),
      },
      {
        petName: 'Giraffe',
        source: 'elvebredd',
        value: 21000,
        currency: 'cookies',
        timestamp: new Date(),
      },
    ];

    await delay(RATE_LIMIT_DELAY);
    return mockData;
  } catch (error) {
    console.error('Error fetching from Elvebredd:', error);
    return [];
  }
}

// Optional: Additional sources
export async function fetchFromAdoptMeTradingValues(): Promise<PetValue[]> {
  try {
    // Placeholder implementation
    await delay(RATE_LIMIT_DELAY);
    return [];
  } catch (error) {
    console.error('Error fetching from Adopt Me Trading Values:', error);
    return [];
  }
}

export async function fetchFromAMVGG(): Promise<PetValue[]> {
  try {
    // Placeholder implementation
    await delay(RATE_LIMIT_DELAY);
    return [];
  } catch (error) {
    console.error('Error fetching from AMVGG:', error);
    return [];
  }
}

// Main function to fetch from all sources
export async function fetchAllSources(): Promise<PetValue[]> {
  const sources = [
    fetchFromAdoptMeTrueValues(),
    fetchFromAdoptFromMe(),
    fetchFromElvebredd(),
    // Optional additional sources:
    // fetchFromAdoptMeTradingValues(),
    // fetchFromAMVGG(),
  ];

  try {
    const results = await Promise.allSettled(sources);
    
    const allValues: PetValue[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allValues.push(...result.value);
      } else {
        console.error(`Source ${index} failed:`, result.reason);
      }
    });

    return allValues;
  } catch (error) {
    console.error('Error fetching from all sources:', error);
    return [];
  }
}

// Fetch values for a specific pet from all sources
export async function fetchPetValues(petName: string): Promise<PetValue[]> {
  const allValues = await fetchAllSources();
  return allValues.filter(v => 
    v.petName.toLowerCase() === petName.toLowerCase()
  );
}
