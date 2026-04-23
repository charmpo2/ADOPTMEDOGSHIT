import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InventoryItem, Pet, Variant, AggregatedValue } from '@/types';
import { pets, getPetById } from '@/lib/data/petDatabase';
import { getSourceValuesForPet } from '@/lib/data/valueSources';
import { calculateAggregatedValue } from '@/lib/utils/valueCalculator';

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  lastSynced: string | null;
  
  // Actions
  addItem: (petId: string, variant: Variant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearInventory: () => void;
  getItemsWithPets: () => (InventoryItem & { pet: Pet; currentValue: AggregatedValue })[];
  getTotalValue: () => number;
  syncWithSupabase: () => Promise<void>;
}

// Generate a simple UUID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Simulated user ID for local storage
const getUserId = () => {
  if (typeof window === 'undefined') return 'anonymous';
  let userId = localStorage.getItem('adoptme-user-id');
  if (!userId) {
    userId = generateId();
    localStorage.setItem('adoptme-user-id', userId);
  }
  return userId;
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      lastSynced: null,

      addItem: (petId: string, variant: Variant, quantity = 1) => {
        const existingItem = get().items.find(
          item => item.petId === petId && item.variant === variant
        );

        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          const newItem: InventoryItem = {
            id: generateId(),
            userId: getUserId(),
            petId,
            variant,
            quantity,
            addedAt: new Date().toISOString(),
          };
          set(state => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearInventory: () => {
        set({ items: [] });
      },

      getItemsWithPets: () => {
        return get().items.map(item => {
          const pet = getPetById(item.petId);
          if (!pet) return null;
          
          const sources = getSourceValuesForPet(item.petId);
          const currentValue = calculateAggregatedValue(item.petId, sources, item.variant);
          
          return {
            ...item,
            pet,
            currentValue,
          };
        }).filter(Boolean) as (InventoryItem & { pet: Pet; currentValue: AggregatedValue })[];
      },

      getTotalValue: () => {
        return get().getItemsWithPets().reduce((total, item) => {
          return total + item.currentValue.communityValue * item.quantity;
        }, 0);
      },

      syncWithSupabase: async () => {
        // Placeholder for Supabase sync - will be implemented when Supabase is connected
        set({ lastSynced: new Date().toISOString() });
      },
    }),
    {
      name: 'adoptme-inventory',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          return localStorage.getItem(name);
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(name);
        },
      })),
      skipHydration: true,
    }
  )
);
