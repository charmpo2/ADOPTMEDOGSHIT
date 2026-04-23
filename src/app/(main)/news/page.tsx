'use client';

// import { CountdownTimer } from '@/components/news/CountdownTimer';
import { PetCarousel } from '@/components/pets/PetCarousel';
import { getNewestPets } from '@/lib/data/petDatabase';
import { Calendar, Sparkles, Bell } from 'lucide-react';

export default function NewsPage() {
  const newestPets = getNewestPets(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">News & Updates</h1>
        <p className="text-gray-600 mt-1">Track weekly updates and new pet releases</p>
      </div>

      {/* Recent Updates */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpdateCard
          title="Latest Pet Drop"
          date="This Friday"
          description="Check out the newest pets added to Adopt Me! New legendary pets, vehicles, and more."
          icon={<Sparkles className="w-5 h-5" />}
          highlight
        />
        <UpdateCard
          title="Trading Value Changes"
          date="Updated hourly"
          description="Values are automatically refreshed from 3 community sources every 5 minutes."
          icon={<Bell className="w-5 h-5" />}
        />
      </section>

      {/* Newest Pets */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Newest Pets</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <PetCarousel />
        </div>
      </section>

      {/* Update History */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Update History</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <HistoryItem
            title="Halloween Event 2024"
            date="October 2024"
            pets={['Shadowbone', 'Pumpkin Pet', 'Ghost']}
          />
          <HistoryItem
            title="Japan Egg Release"
            date="September 2023"
            pets={['Koi Carp', 'Moon Bear', 'Persian Cat']}
          />
          <HistoryItem
            title="Winter Update 2022"
            date="December 2022"
            pets={['Fallow Deer', 'Puffin', 'Husky']}
          />
        </div>
      </section>
    </div>
  );
}

function UpdateCard({ 
  title, 
  date, 
  description, 
  icon, 
  highlight = false 
}: { 
  title: string; 
  date: string; 
  description: string; 
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-6 ${
      highlight 
        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${highlight ? 'bg-yellow-200 text-yellow-700' : 'bg-blue-100 text-blue-600'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {date}
          </p>
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ title, date, pets }: { title: string; date: string; pets: string[] }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex gap-2">
        {pets.map((pet) => (
          <span key={pet} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
            {pet}
          </span>
        ))}
      </div>
    </div>
  );
}
