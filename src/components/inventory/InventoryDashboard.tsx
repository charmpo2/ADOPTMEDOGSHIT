'use client';

import { useState, useEffect } from 'react';
import { InventoryItemWithValue, FilterOptions, SortOption, Variant, Rarity, PetType, PetStatus } from '@/types';
import { PetCard } from './PetCard';
import { AddPet } from './AddPet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share2, Filter, SortAsc, SortDesc } from 'lucide-react';

interface InventoryDashboardProps {
  inventoryId: string;
  items: InventoryItemWithValue[];
  onAddItem: (petName: string, variant: Variant, quantity: number) => Promise<void>;
  onEditItem: (itemId: string, petName: string, variant: Variant, quantity: number) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onExport?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
}

export function InventoryDashboard({
  inventoryId,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onExport,
  onShare,
  isLoading,
}: InventoryDashboardProps) {
  const [filter, setFilter] = useState<FilterOptions>({
    search: '',
    rarity: 'all',
    status: 'all',
    type: 'all',
    variant: 'all',
  });
  
  const [sort, setSort] = useState<SortOption>({
    field: 'dateAdded',
    direction: 'desc',
  });

  const filteredAndSortedItems = items
    .filter((item) => {
      if (filter.search && !item.petName.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'name':
          comparison = a.petName.localeCompare(b.petName);
          break;
        case 'value':
          comparison = a.currentValue.averageValue - b.currentValue.averageValue;
          break;
        case 'dateAdded':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });

  const totalValue = filteredAndSortedItems.reduce(
    (sum, item) => sum + item.currentValue.averageValue * item.quantity,
    0
  );

  const totalPets = filteredAndSortedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const uniquePets = filteredAndSortedItems.length;

  const handleEdit = (item: InventoryItemWithValue) => {
    // TODO: Implement edit dialog
    console.log('Edit item:', item);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold">
            {totalValue.toLocaleString()} Cookies
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total Pets</div>
          <div className="text-2xl font-bold">{totalPets}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Unique Pets</div>
          <div className="text-2xl font-bold">{uniquePets}</div>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <AddPet onAdd={onAddItem} isLoading={isLoading} />
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {onShare && (
            <Button variant="outline" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search pets..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="w-64"
          />
          <Select
            value={sort.field}
            onValueChange={(value: any) => setSort({ ...sort, field: value })}
          >
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
          >
            {sort.direction === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading inventory...</div>
      ) : filteredAndSortedItems.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p>No pets in inventory</p>
          <p className="text-sm mt-2">Add your first pet to get started</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedItems.map((item) => (
            <PetCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
