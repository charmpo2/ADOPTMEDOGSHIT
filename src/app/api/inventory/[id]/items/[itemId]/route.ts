import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { InventoryItem, ApiResponse } from '@/types';

// PUT /api/inventory/[id]/items/[itemId] - Update an inventory item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params;
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
    const { petName, variant, quantity } = body;

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
      .update({
        pet_name: petName !== undefined ? petName : undefined,
        variant: variant !== undefined ? variant : undefined,
        quantity: quantity !== undefined ? quantity : undefined,
      })
      .eq('id', itemId)
      .eq('inventory_id', id)
      .select()
      .single();

    if (error) throw error;

    const response: ApiResponse<InventoryItem> = {
      data: item,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in PUT /api/inventory/[id]/items/[itemId]:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to update inventory item',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/inventory/[id]/items/[itemId] - Delete an inventory item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params;
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Unauthorized',
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

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

    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', itemId)
      .eq('inventory_id', id);

    if (error) throw error;

    const response: ApiResponse<null> = {
      data: null,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/inventory/[id]/items/[itemId]:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to delete inventory item',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
