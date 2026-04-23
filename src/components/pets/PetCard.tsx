'use client';

import { useState } from 'react';
// import { motion } from 'framer-motion';
import Image from 'next/image';
import { Pet, Variant } from '@/types';
import { getSourceValuesForPet } from '@/lib/data/valueSources';
import { calculateAggregatedValue } from '@/lib/utils/valueCalculator';
import { rarityColors, rarityGradients, variantColors } from '@/lib/utils/rarityColors';
import { formatNumber } from '@/lib/utils';
import { useInventoryStore } from '@/lib/stores/inventoryStore';
import { Plus, Check, Sparkles, Crown, Plane, Car } from 'lucide-react';
// import { PetImage } from './PetImage';

interface PetCardProps {
  pet: Pet;
  showAddButton?: boolean;
  compact?: boolean;
}

export function PetCard({ pet, showAddButton = true, compact = false }: PetCardProps) {
  const [variant, setVariant] = useState<Variant>('normal');
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useInventoryStore(state => state.addItem);

  const sources = getSourceValuesForPet(pet.id);
  const aggregatedValue = calculateAggregatedValue(pet.id, sources, variant);

  const handleAdd = () => {
    addItem(pet.id, variant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const rarityStyle = rarityColors[pet.rarity];
  const variantStyle = variantColors[variant];

  const variantIcon: Record<string, React.ReactNode> = {
    normal: null,
    neon: <Sparkles className="w-3 h-3" />,
    mega: <Crown className="w-3 h-3" />,
    fly: <Plane className="w-3 h-3" />,
    ride: <Car className="w-3 h-3" />,
    mega_fly: <Crown className="w-3 h-3" />,
    mega_ride: <Crown className="w-3 h-3" />,
    mega_fly_ride: <Crown className="w-3 h-3" />,
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border-2 ${rarityStyle.border} bg-gradient-to-br ${rarityGradients[pet.rarity]} shadow-lg hover:shadow-xl transition-shadow`}
    >
      {/* Pet Image */}
      <div className="relative aspect-square bg-white/50 flex items-center justify-center p-4">
        <div className="relative w-full h-full">
          {/* Placeholder pet icon - in production would be actual image */}
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full ${rarityStyle.bg} flex items-center justify-center text-4xl`}>
              {pet.type === 'egg' ? '🥚' : pet.type === 'pet' ? '🐾' : '🎁'}
            </div>
          </div>
          
          {/* Rarity Badge */}
          <div className={`absolute top-0 left-0 px-2 py-1 rounded-br-lg text-xs font-bold uppercase ${rarityStyle.bg} ${rarityStyle.text}`}>
            {pet.rarity}
          </div>
          
          {/* Status Badge */}
          {pet.status !== 'in-game' && (
            <div className="absolute top-0 right-0 px-2 py-1 rounded-bl-lg text-xs font-bold bg-red-100 text-red-700">
              {pet.status === 'retired' ? 'Retired' : 'Unreleased'}
            </div>
          )}
        </div>
      </div>

      {/* Pet Info */}
      <div className="p-3 bg-white/80 backdrop-blur-sm">
        <h3 className="font-bold text-gray-900 truncate">{pet.name}</h3>
        
        {/* Variant Toggle */}
        {pet.isNeonAvailable && (
          <div className="flex gap-1 mt-2 mb-2">
            {(['normal', 'neon', 'mega'] as Variant[]).map((v) => (
              pet.isMegaAvailable || v !== 'mega' ? (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`flex-1 px-2 py-1 text-xs rounded-md font-medium transition-colors flex items-center justify-center gap-1 ${
                    variant === v
                      ? `${variantStyle.bg} ${variantStyle.text} ${variantStyle.border}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {variantIcon[v]}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ) : null
            ))}
          </div>
        )}

        {/* Value Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Community Value</div>
            <div className="text-lg font-bold font-mono text-gray-900">
              {formatNumber(aggregatedValue.communityValue)}
            </div>
          </div>
          
          {showAddButton && (
            <button
              onClick={handleAdd}
              className={`p-2 rounded-lg transition-colors ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Confidence Score */}
        <div className="mt-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            aggregatedValue.confidence === 'high' ? 'bg-green-500' :
            aggregatedValue.confidence === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
          }`} />
          <span className="text-xs text-gray-500 capitalize">
            {aggregatedValue.confidence} confidence
          </span>
        </div>
      </div>
    </div>
  );
}
