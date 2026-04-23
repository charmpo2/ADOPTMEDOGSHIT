import { ValueChecker } from '@/components/value-checker/ValueChecker';
import { WeeklyUpdates } from '@/components/updates/WeeklyUpdates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Adopt Me <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Value Checker</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Check real-time pet values from 3 community sources. Build your inventory, track total worth, and stay updated with weekly pet drops.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/inventory">
            <Button size="lg" className="text-lg">
              Manage Inventory
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/value-checker">
            <Button size="lg" variant="outline" className="text-lg">
              Check Values
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Pets in Database"
          value="1,234"
          icon={<Database className="h-6 w-6" />}
          description="Comprehensive pet database"
        />
        <StatCard
          title="Last Update"
          value="2 min ago"
          icon={<Clock className="h-6 w-6" />}
          description="Values refreshed every 5 minutes"
        />
        <StatCard
          title="New Pets This Week"
          value="5"
          icon={<TrendingUp className="h-6 w-6" />}
          description="Latest weekly update"
        />
      </section>

      {/* Value Checker Preview */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Value Check</h2>
          <p className="text-gray-600">Search for any pet to see its current value from multiple sources</p>
        </div>
        <ValueChecker />
      </section>

      {/* Weekly Updates Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Weekly Pet Updates</h2>
          <p className="text-gray-600">Stay informed about new pet releases and limited-time events</p>
        </div>
        <WeeklyUpdates />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Multi-Source Values"
          description="Aggregated from Adopt Me True Values, Adopt From Me, and Elvebredd with confidence scoring"
          icon="📊"
        />
        <FeatureCard
          title="Inventory Tracking"
          description="Build your backpack, add pets manually, and calculate total value automatically"
          icon="🎒"
        />
        <FeatureCard
          title="Weekly Updates"
          description="Track new pet drops with live countdown and update history"
          icon="🆕"
        />
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Track Your Pets?</h2>
        <p className="text-lg mb-8 text-purple-100">
          Join thousands of players tracking their Adopt Me inventory
        </p>
        <Link href="/inventory">
          <Button size="lg" variant="secondary" className="text-lg">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-blue-600">{icon}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Card>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}
