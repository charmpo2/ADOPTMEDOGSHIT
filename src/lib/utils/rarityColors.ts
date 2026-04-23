import { Rarity, Confidence } from '@/types';

export const rarityColors: Record<Rarity, {
  bg: string;
  border: string;
  text: string;
  glow: string;
}> = {
  common: {
    bg: 'bg-gray-200',
    border: 'border-gray-400',
    text: 'text-gray-700',
    glow: 'shadow-gray-200',
  },
  uncommon: {
    bg: 'bg-green-200',
    border: 'border-green-400',
    text: 'text-green-800',
    glow: 'shadow-green-200',
  },
  rare: {
    bg: 'bg-blue-200',
    border: 'border-blue-400',
    text: 'text-blue-800',
    glow: 'shadow-blue-200',
  },
  'ultra-rare': {
    bg: 'bg-purple-200',
    border: 'border-purple-400',
    text: 'text-purple-800',
    glow: 'shadow-purple-200',
  },
  legendary: {
    bg: 'bg-yellow-200',
    border: 'border-yellow-400',
    text: 'text-yellow-900',
    glow: 'shadow-yellow-200',
  },
};

export const rarityGradients: Record<Rarity, string> = {
  common: 'from-gray-100 to-gray-200',
  uncommon: 'from-green-100 to-green-200',
  rare: 'from-blue-100 to-blue-200',
  'ultra-rare': 'from-purple-100 to-purple-200',
  legendary: 'from-yellow-100 to-yellow-200',
};

export const rarityLabels: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  'ultra-rare': 'Ultra-Rare',
  legendary: 'Legendary',
};

export const confidenceColors: Record<Confidence, {
  bg: string;
  text: string;
  border: string;
}> = {
  high: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    border: 'border-green-500',
  },
  medium: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-700',
    border: 'border-yellow-500',
  },
  low: {
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    border: 'border-orange-500',
  },
};

export const variantColors: Record<string, { bg: string; text: string; border: string }> = {
  normal: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
  },
  neon: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    border: 'border-cyan-300',
  },
  mega: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
  },
};

export const statusColors: Record<string, { bg: string; text: string }> = {
  'in-game': {
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
  'retired': {
    bg: 'bg-red-100',
    text: 'text-red-700',
  },
  'unreleased': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
  },
};

export const statusLabels: Record<string, string> = {
  'in-game': 'In Game',
  'retired': 'Retired',
  'unreleased': 'Unreleased',
};

export const typeLabels: Record<string, string> = {
  pet: 'Pet',
  egg: 'Egg',
  vehicle: 'Vehicle',
  potion: 'Potion',
};
