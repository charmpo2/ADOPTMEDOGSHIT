'use client';

import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, Package, Calculator } from 'lucide-react';
import { useInventoryStore } from '@/lib/stores/inventoryStore';
import { formatNumber } from '@/lib/utils';
import { rarityColors, variantColors } from '@/lib/utils/rarityColors';
import { AggregatedValue } from '@/types';

export function Backpack() {
  const { items, removeItem, updateQuantity, getItemsWithPets, getTotalValue, clearInventory } = useInventoryStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const itemsWithPets = getItemsWithPets();
  const totalValue = getTotalValue();

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Backpack is Empty</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Start building your inventory by adding pets from the search page. Your items will be saved automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Value Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Inventory Value</p>
              <p className="text-3xl font-bold font-mono">{formatNumber(totalValue)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Items</p>
            <p className="text-2xl font-bold">{items.reduce((sum, i) => sum + i.quantity, 0)}</p>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {itemsWithPets.map((item) => (
          <BackpackItem
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
          />
        ))}
      </div>

      {/* Clear All Button */}
      <div className="pt-4 border-t border-gray-200">
        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear all items
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Are you sure?</span>
            <button
              onClick={clearInventory}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
            >
              Yes, clear all
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface BackpackItemProps {
  item: {
    id: string;
    pet: {
      id: string;
      name: string;
      rarity: import('@/types').Rarity;
      imageUrl: string;
    };
    variant: import('@/types').Variant;
    quantity: number;
    currentValue: AggregatedValue;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function BackpackItem({ item, onRemove, onUpdateQuantity }: BackpackItemProps) {
  const rarityStyle = rarityColors[item.pet.rarity];
  const variantStyle = variantColors[item.variant];

  return (
    <div
      className={`relative rounded-xl overflow-hidden border-2 ${rarityStyle.border} bg-white shadow-md`}
    >
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
        style={{ opacity: 0.8 }}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Pet Image */}
      <div className={`aspect-square ${rarityStyle.bg} flex items-center justify-center`}>
        <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-2xl">
          {item.pet.id.includes('egg') ? '🥚' : '🐾'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.pet.name}</h4>
        
        {/* Variant Badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-1 ${variantStyle.bg} ${variantStyle.text}`}>
          {item.variant.charAt(0).toUpperCase() + item.variant.slice(1)}
        </div>

        {/* Value */}
        <p className="text-sm font-mono font-bold text-gray-700 mt-2">
          {formatNumber(item.currentValue.communityValue * item.quantity)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-sm font-semibold text-gray-700">×{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
