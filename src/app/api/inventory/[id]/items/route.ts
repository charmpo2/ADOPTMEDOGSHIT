import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { InventoryItem, ApiResponse } from '@/types';

// GET /api/inventory/[id]/items - Get all items in an inventory
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Unauthorized',
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Check if user owns the inventory or if it's public
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventories')
      .select('user_id, is_public')
      .eq('id', id)
      .single();

    if (inventoryError) throw inventoryError;

    if (inventory.user_id !== user.id && !inventory.is_public) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Forbidden',
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { data: items, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('inventory_id', id)
      .order('added_at', { ascending: false });

    if (error) throw error;

    const response: ApiResponse<InventoryItem[]> = {
      data: items || [],
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/inventory/[id]/items:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to fetch inventory items',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/inventory/[id]/items - Add an item to inventory
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
    const { petName, variant = 'normal', quantity = 1 } = body;

    // Check if user owns the inventory
    const { data: inventory, error: checkError } = await supabase
      .from('inventories')
      .select('user_id')
      .eq('id', id)
      .single();

    if (checkError || inventory.user_id !== user.id) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Forbidden',
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { data: item, error } = await supabase
      .from('inventory_items')
      .insert({
        inventory_id: id,
        pet_name: petName,
        variant,
        quantity,
      })
      .select()
      .single();

    if (error) throw error;

    const response: ApiResponse<InventoryItem> = {
      data: item,
      success: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/inventory/[id]/items:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to add inventory item',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
