import { Backpack } from '@/components/inventory/Backpack';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Backpack | AdoptMe Values',
  description: 'View and manage your Adopt Me pet inventory with real-time value tracking.',
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Backpack</h1>
          <p className="text-gray-600 mt-1">Manage your pet inventory and track total value</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <Backpack />
      </div>
    </div>
  );
}
