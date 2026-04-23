import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Inventory, InventoryItem, ApiResponse } from '@/types';

// GET /api/inventory - Get user's inventories
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Unauthorized',
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { data: inventories, error } = await supabase
      .from('inventories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const response: ApiResponse<Inventory[]> = {
      data: inventories || [],
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/inventory:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to fetch inventories',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/inventory - Create a new inventory
export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Unauthorized',
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    const body = await request.json();
    const { name, isPublic = false } = body;

    const { data: inventory, error } = await supabase
      .from('inventories')
      .insert({
        user_id: user.id,
        name: name || 'My Inventory',
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;

    const response: ApiResponse<Inventory> = {
      data: inventory,
      success: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/inventory:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to create inventory',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
