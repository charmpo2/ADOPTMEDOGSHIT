'use client';

import { useState, useRef } from 'react';
// import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Pet } from '@/types';
import { getNewestPets } from '@/lib/data/petDatabase';
import { PetCard } from './PetCard';

export function PetCarousel() {
  const newestPets = getNewestPets(8);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, newestPets.length - 1));
    setCurrentIndex(newIndex);
    
    if (containerRef.current) {
      const cardWidth = 220; // Card width + gap
      containerRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const next = () => scrollToIndex(currentIndex + 1);
  const prev = () => scrollToIndex(currentIndex - 1);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Newest Pets</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= newestPets.length - 4}
            className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newestPets.map((pet, index) => (
            <div
              key={pet.id}
              className="snap-start flex-shrink-0 w-52"
            >
              <PetCard pet={pet} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1 mt-4">
        {newestPets.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
