'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
import { Backpack, Package } from 'lucide-react';
import { useInventoryStore } from '@/lib/stores/inventoryStore';

export function BackpackButton() {
  const itemCount = useInventoryStore(state => 
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/inventory">
      <div
        className="relative p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Backpack className="w-6 h-6 text-gray-700" />
        
        {itemCount > 0 && (
          <span
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}

        {isHovered && (
          <div
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <Package className="w-5 h-5" />
              <span className="font-semibold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Click to view your inventory</p>
          </div>
        )}
      </div>
    </Link>
  );
}
