'use client';

import { useState } from 'react';
import { AggregatedValue, Variant } from '@/types';
import { formatValue, getConfidenceColor, getConfidenceLabel } from '@/lib/valueAggregator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Plus } from 'lucide-react';

export function ValueChecker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [variant, setVariant] = useState<Variant>('normal');
  const [result, setResult] = useState<AggregatedValue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/values/${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Pet not found');
      }
    } catch (err) {
      setError('Failed to fetch pet value');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petName: searchTerm.trim() }),
      });
      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to refresh values');
      }
    } catch (err) {
      setError('Failed to refresh pet value');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = () => {
    // TODO: Implement add to inventory functionality
    console.log('Add to inventory:', result);
  };

  const variants: { value: Variant; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'neon', label: 'Neon' },
    { value: 'mega', label: 'Mega' },
    { value: 'fly', label: 'Fly' },
    { value: 'ride', label: 'Ride' },
    { value: 'mega_fly', label: 'Mega Fly' },
    { value: 'mega_ride', label: 'Mega Ride' },
    { value: 'mega_fly_ride', label: 'Mega Fly Ride' },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Pet Value Checker</h2>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search for a pet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select value={variant} onValueChange={(value: Variant) => setVariant(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          {result && (
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </Card>

      {isLoading && (
        <Card className="p-12 text-center text-gray-500">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>Loading pet values...</p>
        </Card>
      )}

      {result && !isLoading && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold">{result.petName}</h3>
                <p className="text-gray-600 mt-1">
                  {variants.find((v) => v.value === variant)?.label}
                </p>
              </div>
              
              <Button onClick={handleAddToInventory}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Inventory
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Average Value</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatValue(result.averageValue, result.currency)}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Min Value</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatValue(result.minValue, result.currency)}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Max Value</div>
                <div className="text-2xl font-bold text-purple-700">
                  {formatValue(result.maxValue, result.currency)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Confidence:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                  {getConfidenceLabel(result.confidence)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sources:</span>
                <span className="font-semibold">{result.sources.length} sources</span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Last Updated:</span>
                <span>{new Date(result.lastUpdated).toLocaleString()}</span>
              </div>
            </div>

            {result.sources.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Source Breakdown</h4>
                <div className="space-y-2">
                  {result.sources.map((source, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 capitalize">{source.source}</span>
                      <span className="font-semibold">
                        {formatValue(source.value, source.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
