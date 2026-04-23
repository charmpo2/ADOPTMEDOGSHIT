import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Inventory, ApiResponse } from '@/types';

// GET /api/inventory/[id] - Get a specific inventory with items
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

    // Get inventory details
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventories')
      .select('*')
      .eq('id', id)
      .single();

    if (inventoryError) throw inventoryError;

    // Check if user owns the inventory or if it's public
    if (inventory.user_id !== user.id && !inventory.is_public) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Forbidden',
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    // Get inventory items
    const { data: items, error: itemsError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('inventory_id', id)
      .order('added_at', { ascending: false });

    if (itemsError) throw itemsError;

    const response: ApiResponse<{ inventory: Inventory; items: any[] }> = {
      data: {
        inventory,
        items: items || [],
      },
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/inventory/[id]:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to fetch inventory',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/inventory/[id] - Update inventory details
export async function PUT(
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
    const { name, isPublic } = body;

    // Check if user owns the inventory
    const { data: existingInventory, error: checkError } = await supabase
      .from('inventories')
      .select('user_id')
      .eq('id', id)
      .single();

    if (checkError || existingInventory.user_id !== user.id) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Forbidden',
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { data: inventory, error } = await supabase
      .from('inventories')
      .update({
        name: name !== undefined ? name : undefined,
        is_public: isPublic !== undefined ? isPublic : undefined,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const response: ApiResponse<Inventory> = {
      data: inventory,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in PUT /api/inventory/[id]:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to update inventory',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/inventory/[id] - Delete an inventory
export async function DELETE(
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

    // Check if user owns the inventory
    const { data: existingInventory, error: checkError } = await supabase
      .from('inventories')
      .select('user_id')
      .eq('id', id)
      .single();

    if (checkError || existingInventory.user_id !== user.id) {
      const response: ApiResponse<null> = {
        data: null,
        error: 'Forbidden',
        success: false,
      };
      return NextResponse.json(response, { status: 403 });
    }

    const { error } = await supabase
      .from('inventories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    const response: ApiResponse<null> = {
      data: null,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/inventory/[id]:', error);
    
    const response: ApiResponse<null> = {
      data: null,
      error: 'Failed to delete inventory',
      success: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
