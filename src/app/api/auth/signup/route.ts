import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ApiResponse, AuthUser } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Email and password are required',
        success: false,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const response: ApiResponse<{ user: any; session: any }> = {
      data: {
        user: data.user,
        session: data.session,
      },
      success: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/auth/signup:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: error.message || 'Failed to sign up',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
