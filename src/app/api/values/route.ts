import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSources, fetchPetValues } from '@/lib/valueFetchers';
import { aggregateAllPetValues, aggregatePetValues } from '@/lib/valueAggregator';
import { AggregatedValue, ApiResponse } from '@/types';

// GET /api/values - Get all aggregated pet values
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const petName = searchParams.get('petName');
    const refresh = searchParams.get('refresh') === 'true';

    if (petName) {
      // Get values for a specific pet
      const petValues = await fetchPetValues(petName);
      const aggregatedValue = aggregatePetValues(petValues);

      const response: ApiResponse<AggregatedValue> = {
        data: aggregatedValue,
        success: true,
      };

      return NextResponse.json(response);
    }

    // Get all values
    const allValues = await fetchAllSources();
    const aggregatedValues = aggregateAllPetValues(allValues);

    const response: ApiResponse<AggregatedValue[]> = {
      data: aggregatedValues,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/values:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to fetch pet values',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/values/refresh - Force refresh values from all sources
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petName } = body;

    if (petName) {
      // Refresh specific pet
      const petValues = await fetchPetValues(petName);
      const aggregatedValue = aggregatePetValues(petValues);

      const response: ApiResponse<AggregatedValue> = {
        data: aggregatedValue,
        success: true,
      };

      return NextResponse.json(response);
    }

    // Refresh all values
    const allValues = await fetchAllSources();
    const aggregatedValues = aggregateAllPetValues(allValues);

    const response: ApiResponse<AggregatedValue[]> = {
      data: aggregatedValues,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/values:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to refresh pet values',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
