import { PetUpdate, NewPet } from '@/types';

// Monitor official Adopt Me sources for updates
export async function fetchAdoptMeUpdates(): Promise<PetUpdate[]> {
  try {
    // Note: This is a placeholder implementation
    // In production, you would need to either:
    // 1. Use their official API if available
    // 2. Scrape their website (respecting robots.txt)
    // 3. Monitor their social media accounts
    
    // Mock data for demonstration
    const mockUpdates: PetUpdate[] = [
      {
        id: '1',
        title: 'Birthday Magic Update',
        description: 'Celebrate with new birthday-themed pets and accessories!',
        releaseDate: new Date('2024-04-26'),
        updateType: 'weekly',
        petsAdded: ['Birthday Cake Dragon', 'Party Parrot', 'Balloon Dog'],
        petsRemoved: [],
        imageUrl: '/images/updates/birthday-magic.jpg',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Spring Festival Event',
        description: 'Welcome spring with limited-time floral pets',
        releaseDate: new Date('2024-04-19'),
        updateType: 'event',
        petsAdded: ['Cherry Blossom Dragon', 'Flower Fairy', 'Spring Bunny'],
        petsRemoved: ['Winter Wolf'],
        imageUrl: '/images/updates/spring-festival.jpg',
        createdAt: new Date(),
      },
    ];

    return mockUpdates;
  } catch (error) {
    console.error('Error fetching Adopt Me updates:', error);
    return [];
  }
}

// Get the latest update
export async function getLatestUpdate(): Promise<PetUpdate | null> {
  const updates = await fetchAdoptMeUpdates();
  return updates.length > 0 ? updates[0] : null;
}

// Get upcoming updates
export async function getUpcomingUpdates(): Promise<PetUpdate[]> {
  const updates = await fetchAdoptMeUpdates();
  const now = new Date();
  return updates.filter(update => new Date(update.releaseDate) > now);
}

// Get update history
export async function getUpdateHistory(limit: number = 10): Promise<PetUpdate[]> {
  const updates = await fetchAdoptMeUpdates();
  const now = new Date();
  return updates
    .filter(update => new Date(update.releaseDate) <= now)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, limit);
}

// Get new pets from a specific update
export async function getNewPetsForUpdate(updateId: string): Promise<NewPet[]> {
  // Note: In production, this would fetch from the database
  const mockNewPets: NewPet[] = [
    {
      id: '1',
      name: 'Birthday Cake Dragon',
      updateId: '1',
      rarity: 'legendary',
      howToObtain: 'Birthday Event',
      imageUrl: '/images/pets/birthday-cake-dragon.jpg',
      initialValueEstimate: 5000,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Party Parrot',
      updateId: '1',
      rarity: 'ultra-rare',
      howToObtain: 'Birthday Event',
      imageUrl: '/images/pets/party-parrot.jpg',
      initialValueEstimate: 2000,
      createdAt: new Date(),
    },
  ];

  return mockNewPets.filter(pet => pet.updateId === updateId);
}

// Calculate countdown to next update
export function getCountdownToNextUpdate(update: PetUpdate): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const releaseDate = new Date(update.releaseDate);
  const diff = releaseDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// Format update type for display
export function formatUpdateType(type: string): string {
  const typeLabels: Record<string, string> = {
    weekly: 'Weekly Update',
    event: 'Special Event',
    seasonal: 'Seasonal Update',
    special: 'Special Update',
  };
  return typeLabels[type] || type;
}
