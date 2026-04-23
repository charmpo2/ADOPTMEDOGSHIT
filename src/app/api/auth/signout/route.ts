import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    const response: ApiResponse<null> = {
      data: null,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in POST /api/auth/signout:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: error.message || 'Failed to sign out',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
