import { NextRequest, NextResponse } from 'next/server';
import { fetchAdoptMeUpdates, getLatestUpdate, getUpcomingUpdates, getUpdateHistory } from '@/lib/weeklyUpdates';
import { PetUpdate, ApiResponse } from '@/types';

// GET /api/updates - Get all updates or specific type
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'latest', 'upcoming', 'history'
    const limit = parseInt(searchParams.get('limit') || '10');

    let updates: PetUpdate[];

    switch (type) {
      case 'latest':
        const latest = await getLatestUpdate();
        updates = latest ? [latest] : [];
        break;
      case 'upcoming':
        updates = await getUpcomingUpdates();
        break;
      case 'history':
        updates = await getUpdateHistory(limit);
        break;
      default:
        updates = await fetchAdoptMeUpdates();
    }

    const response: ApiResponse<PetUpdate[]> = {
      data: updates,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/updates:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to fetch updates',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
