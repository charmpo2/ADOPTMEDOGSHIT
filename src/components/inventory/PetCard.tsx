'use client';

import { InventoryItemWithValue, Variant } from '@/types';
import { formatValue, getConfidenceColor, getConfidenceLabel } from '@/lib/valueAggregator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

interface PetCardProps {
  item: InventoryItemWithValue;
  onEdit?: (item: InventoryItemWithValue) => void;
  onDelete?: (itemId: string) => void;
  showActions?: boolean;
}

export function PetCard({ item, onEdit, onDelete, showActions = true }: PetCardProps) {
  const { petName, variant, quantity, currentValue } = item;
  
  const variantLabels: Record<Variant, string> = {
    normal: 'Normal',
    neon: 'Neon',
    mega: 'Mega',
    fly: 'Fly',
    ride: 'Ride',
    mega_fly: 'Mega Fly',
    mega_ride: 'Mega Ride',
    mega_fly_ride: 'Mega Fly Ride',
  };

  const totalValue = currentValue.averageValue * quantity;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{petName}</h3>
            <p className="text-sm text-gray-600">{variantLabels[variant]}</p>
            {quantity > 1 && (
              <p className="text-sm text-gray-500">x{quantity}</p>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Value:</span>
            <span className="font-semibold">
              {formatValue(totalValue, currentValue.currency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Range:</span>
            <span className="text-gray-800">
              {formatValue(currentValue.minValue, currentValue.currency)} - {formatValue(currentValue.maxValue, currentValue.currency)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Confidence:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(currentValue.confidence)}`}>
              {getConfidenceLabel(currentValue.confidence)}
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Updated {new Date(currentValue.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}
