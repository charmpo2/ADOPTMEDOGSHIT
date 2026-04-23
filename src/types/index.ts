// Pet Types
export type Rarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
export type PetType = 'pet' | 'egg' | 'vehicle' | 'potion' | 'toy' | 'food';
export type PetStatus = 'in-game' | 'retired' | 'unreleased' | 'limited';
export type Variant = 'normal' | 'neon' | 'mega' | 'fly' | 'ride' | 'mega_fly' | 'mega_ride' | 'mega_fly_ride';

// Value Sources
export type ValueSource = 'adoptmetruevalues' | 'adoptfromme' | 'elvebredd' | 'adoptmetradingvalues' | 'amvgg';
export type ValueCurrency = 'cookies' | 'shark' | 'frost';
export type Confidence = 'high' | 'medium' | 'low';

// Pet Interface
export interface Pet {
  id: string;
  name: string;
  rarity: Rarity;
  type: PetType;
  status: PetStatus;
  imageUrl: string;
  releaseDate?: string;
  isNeonAvailable: boolean;
  isMegaAvailable: boolean;
  isFlyAvailable: boolean;
  isRideAvailable: boolean;
  description?: string;
  howToObtain?: string;
}

// Value Source Data
export interface PetValue {
  petName: string;
  source: ValueSource;
  value: number;
  currency: ValueCurrency;
  timestamp: Date;
}

export interface SourceValue {
  petId: string;
  source: ValueSource;
  normal: number;
  neon: number;
  mega: number;
  fly: number;
  ride: number;
  currency: ValueCurrency;
  lastUpdated: string;
}

// Aggregated Value Data
export interface AggregatedValue {
  petName: string;
  averageValue: number;
  minValue: number;
  maxValue: number;
  currency: ValueCurrency;
  sources: PetValue[];
  confidence: Confidence;
  lastUpdated: Date;
}

export interface PetValueWithVariants {
  petName: string;
  normal: AggregatedValue;
  neon: AggregatedValue;
  mega: AggregatedValue;
  fly: AggregatedValue;
  ride: AggregatedValue;
  megaFly: AggregatedValue;
  megaRide: AggregatedValue;
  megaFlyRide: AggregatedValue;
}

// Inventory Types
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Inventory {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  inventoryId: string;
  petName: string;
  variant: Variant;
  quantity: number;
  addedAt: Date;
}

export interface InventoryItemWithValue extends InventoryItem {
  currentValue: AggregatedValue;
  pet?: Pet;
}

export interface InventoryStats {
  totalValue: number;
  totalPets: number;
  totalUniquePets: number;
  rarestPet: string;
  mostValuablePet: string;
}

// Weekly Updates
export type UpdateType = 'weekly' | 'event' | 'seasonal' | 'special';

export interface PetUpdate {
  id: string;
  title: string;
  description: string;
  releaseDate: Date;
  updateType: UpdateType;
  petsAdded: string[];
  petsRemoved: string[];
  imageUrl?: string;
  createdAt: Date;
}

export interface NewPet {
  id: string;
  name: string;
  updateId: string;
  rarity: Rarity;
  howToObtain: string;
  imageUrl?: string;
  initialValueEstimate?: number;
  createdAt: Date;
}

// Filter and Search
export interface FilterOptions {
  search: string;
  rarity: Rarity | 'all';
  status: PetStatus | 'all';
  type: PetType | 'all';
  variant: Variant | 'all';
}

export interface SortOption {
  field: 'name' | 'value' | 'rarity' | 'dateAdded';
  direction: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Authentication
export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Trade Calculator
export interface TradeItem {
  petName: string;
  variant: Variant;
  quantity: number;
  value: number;
}

export interface TradeResult {
  yourTotal: number;
  theirTotal: number;
  result: 'win' | 'fair' | 'lose';
  difference: number;
  percentage: number;
}
