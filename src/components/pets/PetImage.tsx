import { Pet, Rarity } from '@/types';
import { rarityColors } from '@/lib/utils/rarityColors';

interface PetImageProps {
  pet: Pet;
  size?: number;
}

export function PetImage({ pet, size = 80 }: PetImageProps) {
  const rarityStyle = rarityColors[pet.rarity];
  
  // Generate SVG-based pet icon based on pet type and rarity
  const getPetIcon = () => {
    if (pet.type === 'egg') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="35" ry="45" fill={rarityStyle.bg.replace('bg-', '#')} stroke={rarityStyle.border.replace('border-', '#')} strokeWidth="3"/>
          <ellipse cx="50" cy="50" rx="25" ry="35" fill={rarityStyle.text.replace('text-', '#')} opacity="0.3"/>
        </svg>
      );
    }
    
    // Pet icons based on rarity
    const petShapes: Record<Rarity, React.ReactNode> = {
      common: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="35" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="3"/>
          <circle cx="40" cy="40" r="5" fill="#4b5563"/>
          <circle cx="60" cy="40" r="5" fill="#4b5563"/>
          <path d="M 40 60 Q 50 70 60 60" stroke="#4b5563" strokeWidth="3" fill="none"/>
        </svg>
      ),
      uncommon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="35" fill="#86efac" stroke="#4ade80" strokeWidth="3"/>
          <circle cx="40" cy="40" r="5" fill="#166534"/>
          <circle cx="60" cy="40" r="5" fill="#166534"/>
          <path d="M 40 60 Q 50 70 60 60" stroke="#166534" strokeWidth="3" fill="none"/>
          <path d="M 50 25 L 50 15" stroke="#166534" strokeWidth="2"/>
          <path d="M 50 25 L 40 18" stroke="#166534" strokeWidth="2"/>
          <path d="M 50 25 L 60 18" stroke="#166534" strokeWidth="2"/>
        </svg>
      ),
      rare: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="35" fill="#93c5fd" stroke="#60a5fa" strokeWidth="3"/>
          <circle cx="40" cy="40" r="5" fill="#1e40af"/>
          <circle cx="60" cy="40" r="5" fill="#1e40af"/>
          <path d="M 40 60 Q 50 70 60 60" stroke="#1e40af" strokeWidth="3" fill="none"/>
          <polygon points="50,15 55,25 50,35 45,25" fill="#1e40af"/>
        </svg>
      ),
      'ultra-rare': (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="35" fill="#c4b5fd" stroke="#a78bfa" strokeWidth="3"/>
          <circle cx="40" cy="40" r="5" fill="#5b21b6"/>
          <circle cx="60" cy="40" r="5" fill="#5b21b6"/>
          <path d="M 40 60 Q 50 70 60 60" stroke="#5b21b6" strokeWidth="3" fill="none"/>
          <polygon points="50,12 56,25 50,38 44,25" fill="#5b21b6"/>
          <circle cx="50" cy="50" r="3" fill="#ffd700"/>
        </svg>
      ),
      legendary: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="legendaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047"/>
              <stop offset="50%" stopColor="#facc15"/>
              <stop offset="100%" stopColor="#fbbf24"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="35" fill="url(#legendaryGradient)" stroke="#eab308" strokeWidth="4"/>
          <circle cx="40" cy="40" r="5" fill="#854d0e"/>
          <circle cx="60" cy="40" r="5" fill="#854d0e"/>
          <path d="M 40 60 Q 50 70 60 60" stroke="#854d0e" strokeWidth="3" fill="none"/>
          <polygon points="50,10 58,25 50,42 42,25" fill="#854d0e"/>
          <circle cx="50" cy="50" r="5" fill="#fff" opacity="0.8"/>
          <path d="M 30 30 L 70 30 L 50 20 Z" fill="#854d0e" opacity="0.5"/>
          <path d="M 30 70 L 70 70 L 50 80 Z" fill="#854d0e" opacity="0.5"/>
        </svg>
      ),
    };
    
    return petShapes[pet.rarity];
  };

  return (
    <div 
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {getPetIcon()}
    </div>
  );
}
