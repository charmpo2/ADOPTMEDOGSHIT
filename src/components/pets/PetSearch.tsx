'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Pet, Rarity, PetType, PetStatus, FilterOptions } from '@/types';
import { pets } from '@/lib/data/petDatabase';
import { rarityLabels, typeLabels, statusLabels } from '@/lib/utils/rarityColors';
import { PetCard } from './PetCard';
import Fuse from 'fuse.js';

const rarities: Rarity[] = ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary'];
const types: PetType[] = ['pet', 'egg', 'vehicle', 'potion'];
const statuses: PetStatus[] = ['in-game', 'retired'];

export function PetSearch() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    rarity: 'all',
    status: 'all',
    type: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(pets, {
      keys: ['name', 'rarity', 'type'],
      threshold: 0.3,
    });
  }, []);

  const filteredPets = useMemo(() => {
    let results = pets;

    // Apply search
    if (filters.search) {
      const searchResults = fuse.search(filters.search);
      results = searchResults.map(r => r.item);
    }

    // Apply filters
    if (filters.rarity !== 'all') {
      results = results.filter(p => p.rarity === filters.rarity);
    }
    if (filters.status !== 'all') {
      results = results.filter(p => p.status === filters.status);
    }
    if (filters.type !== 'all') {
      results = results.filter(p => p.type === filters.type);
    }

    return results;
  }, [filters, fuse]);

  const hasActiveFilters = filters.rarity !== 'all' || filters.status !== 'all' || filters.type !== 'all';

  const clearFilters = () => {
    setFilters({
      search: '',
      rarity: 'all',
      status: 'all',
      type: 'all',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search pets..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
            showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Rarity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
              <select
                value={filters.rarity}
                onChange={(e) => setFilters({ ...filters, rarity: e.target.value as Rarity | 'all' })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Rarities</option>
                {rarities.map(r => (
                  <option key={r} value={r}>{rarityLabels[r]}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as PetType | 'all' })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Types</option>
                {types.map(t => (
                  <option key={t} value={t}>{typeLabels[t]}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as PetStatus | 'all' })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Status</option>
                {statuses.map(s => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredPets.length} of {pets.length} pets
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredPets.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pets found matching your criteria</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
