import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ApiResponse, AuthUser } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Not authenticated',
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: ApiResponse<AuthUser> = {
      data: user as AuthUser,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in GET /api/auth/user:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: error.message || 'Failed to get user',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
