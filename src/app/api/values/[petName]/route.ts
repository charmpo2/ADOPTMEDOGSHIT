import { NextRequest, NextResponse } from 'next/server';
import { fetchPetValues } from '@/lib/valueFetchers';
import { aggregatePetValues } from '@/lib/valueAggregator';
import { AggregatedValue, ApiResponse } from '@/types';

// GET /api/values/[petName] - Get aggregated value for a specific pet
export async function GET(
  request: NextRequest,
  { params }: { params: { petName: string } }
) {
  try {
    const { petName } = params;
    const decodedPetName = decodeURIComponent(petName);

    const petValues = await fetchPetValues(decodedPetName);
    const aggregatedValue = aggregatePetValues(petValues);

    const response: ApiResponse<AggregatedValue> = {
      data: aggregatedValue,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/values/[petName]:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to fetch pet value',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
