import { SourceValue, ValueSource, Variant } from '@/types';
import { pets } from './petDatabase';

// Simulated value data from three community sources
// In production, these would be fetched from actual APIs

const createSourceValue = (
  petId: string, 
  source: ValueSource, 
  baseValue: number,
  variance: number = 0.15
): SourceValue => {
  // Add realistic variance between sources (±15% typical)
  const randomFactor = 1 + (Math.random() * variance * 2 - variance);
  const normal = Math.round(baseValue * randomFactor);
  
  // Neon is typically 4x + premium
  const neonMultiplier = 4.2;
  // Mega is typically 4x neon + premium  
  const megaMultiplier = 4.5;
  
  return {
    petId,
    source,
    normal,
    neon: Math.round(normal * neonMultiplier),
    mega: Math.round(normal * neonMultiplier * megaMultiplier),
    lastUpdated: new Date().toISOString(),
  };
};

// Base values for legendary pets (in "value" units - typically compared to fly ride legendaries)
const legendaryBaseValues: Record<string, number> = {
  'shadow': 285,
  'bat-dragon': 245,
  'frost': 68,
  'owl': 52,
  'parrot': 50,
  'crow': 48,
  'evil-unicorn': 42,
  'arctic-reindeer': 35,
  'giraffe': 165,
  'turtle': 20,
  'kangaroo': 18,
  'queen-bee': 15,
  'king-monkey': 22,
  'griffin': 12,
  'dragon': 10,
  'unicorn': 8,
  'golden-rat': 25,
  'golden-penguin': 14,
  'diamond-dragon': 32,
  'diamond-griffin': 18,
  'diamond-unicorn': 28,
  'albino-monkey': 16,
  'ninja-monkey': 14,
  'cerberus': 9,
  'kitsune': 11,
  'guardian-lion': 13,
  'phoenix': 12,
  'goldhorn': 14,
  'diamond-ladybug': 10,
  'peacock': 8,
  'red-squirrel': 7,
  'axolotl': 9,
  'lamb': 11,
  'koi-carp': 24,
  'moon-bear': 19,
  'persian-cat': 17,
  'sugar-glider': 15,
  'fallow-deer': 13,
  'robot': 12,
  'shadow-bone': 35,
  'dire-stag': 16,
};

// Base values for ultra-rare pets
const ultraRareBaseValues: Record<string, number> = {
  'turkey': 14,
  'llama': 12,
  'shiba-inu': 5,
  'horse': 6,
  'panda': 5,
  'sloth': 6,
  'zombie-buffalo': 11,
  'hedgehog': 22,
  'flamingo': 18,
  'lion': 16,
  'ghost': 8,
  'puffin': 7,
  'corgi': 6,
  'diamond-ladybug': 10,
  'harp-seal': 5,
};

// Base values for rare pets
const rareBaseValues: Record<string, number> = {
  'cow': 9,
  'pig': 7,
  'polar-bear': 5,
  'reindeer': 4,
  'swan': 4,
  'rat': 3,
  'emu': 3,
  'monkey': 3,
  'business-monkey': 5,
  'toy-monkey': 4,
  'snow-puma': 3,
  'beaver': 3,
  'elephant': 4,
  'hyena': 4,
  'seahorse': 3,
  'starfish': 3,
  'shark': 4,
  'husky': 3,
  'sheep': 3,
  'pumpkin': 4,
};

// Base values for uncommon pets
const uncommonBaseValues: Record<string, number> = {
  'black-panther': 3,
  'capybara': 3,
  'meerkat': 3,
  'pink-cat': 4,
  'blue-dog': 5,
  'wolf': 2,
  'dingo': 2,
  'drake': 3,
  'silly-duck': 3,
  'rabbit': 2,
  'crab': 2,
  'dolphin': 2,
  'stingray': 2,
  'walrus': 2,
};

// Base values for common pets
const commonBaseValues: Record<string, number> = {
  'chicken': 2,
  'robin': 2,
  'bunny': 1,
  'fish': 1,
  'seal': 1,
};

// Egg values
const eggBaseValues: Record<string, number> = {
  'safari-egg': 85,
  'jungle-egg': 65,
  'farm-egg': 45,
  'christmas-egg': 35,
  'aussie-egg': 12,
  'fossil-egg': 8,
  'ocean-egg': 6,
  'mythic-egg': 5,
  'japan-egg': 15,
  'royal-egg': 1,
  'pet-egg': 1,
  'cracked-egg': 1,
};

// Get base value for any pet
const getBaseValue = (petId: string): number => {
  return legendaryBaseValues[petId] || 
         ultraRareBaseValues[petId] || 
         rareBaseValues[petId] || 
         uncommonBaseValues[petId] || 
         commonBaseValues[petId] || 
         eggBaseValues[petId] || 
         1;
};

// Generate all source values for all pets
export const generateAllSourceValues = (): SourceValue[] => {
  const sources: ValueSource[] = ['elvebredd', 'ggvalues', 'amtv'];
  const allValues: SourceValue[] = [];
  
  for (const pet of pets) {
    const baseValue = getBaseValue(pet.id);
    
    for (const source of sources) {
      // Each source has slightly different variance to simulate real market differences
      let variance = 0.15;
      if (source === 'elvebredd') variance = 0.12;
      if (source === 'ggvalues') variance = 0.18;
      if (source === 'amtv') variance = 0.10;
      
      // Add some systematic bias per source (e.g., GG tends higher, AMTV tends lower)
      let bias = 1;
      if (source === 'elvebredd') bias = 1.02;
      if (source === 'ggvalues') bias = 1.05;
      if (source === 'amtv') bias = 0.98;
      
      const adjustedBase = baseValue * bias;
      allValues.push(createSourceValue(pet.id, source, adjustedBase, variance));
    }
  }
  
  return allValues;
};

// Store for simulated data
let sourceValuesCache: SourceValue[] | null = null;

export const getSourceValues = (): SourceValue[] => {
  if (!sourceValuesCache) {
    sourceValuesCache = generateAllSourceValues();
  }
  return sourceValuesCache;
};

export const getSourceValuesForPet = (petId: string): SourceValue[] => {
  return getSourceValues().filter(v => v.petId === petId);
};

export const refreshSourceValues = (): SourceValue[] => {
  sourceValuesCache = generateAllSourceValues();
  return sourceValuesCache;
};
