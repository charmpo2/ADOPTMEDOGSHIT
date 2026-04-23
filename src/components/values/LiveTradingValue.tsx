'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { AggregatedValue } from '@/types';
import { formatNumber } from '@/lib/utils';

interface LiveTradingValueProps {
  value: AggregatedValue;
  showLive?: boolean;
}

export function LiveTradingValue({ value, showLive = true }: LiveTradingValueProps) {
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!showLive) return;

    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setIsLive(true);
      setLastUpdate(new Date());
      setTimeout(() => setIsLive(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [showLive]);

  const variance = value.maxValue - value.minValue;
  const variancePercent = (variance / (value.communityValue ?? value.averageValue)) * 100;
  
  const getTrend = () => {
    if (variancePercent < 5) return { icon: Minus, color: 'text-gray-500', label: 'Stable' };
    if (variancePercent < 15) return { icon: TrendingUp, color: 'text-green-500', label: 'Rising' };
    return { icon: TrendingDown, color: 'text-red-500', label: 'Volatile' };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isLive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-red-500">LIVE</span>
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-sm font-semibold text-gray-700">Community Value</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{new Date(value.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="p-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-3xl font-bold font-mono text-gray-900">
              {formatNumber(value.communityValue ?? value.averageValue)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`flex items-center gap-1 text-xs font-medium ${trend.color}`}>
                <TrendIcon className="w-3 h-3" />
                <span>{trend.label}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                value.confidence === 'high' ? 'bg-green-500' :
                value.confidence === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
              }`} />
              <span className="text-xs text-gray-500 capitalize">{value.confidence} confidence</span>
            </div>
          </div>
          
        </div>

        {/* Source Breakdown */}
        <div className="space-y-2 pt-3 border-t border-gray-100">
          {value.sources && value.sources.map((source, index) => (
            <SourceRow key={index} label={source.source} value={source.value} />
          ))}
        </div>

        {/* Variance Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Variance Range</span>
            <span className="font-mono text-gray-700">
              {formatNumber(value.minValue)} - {formatNumber(value.maxValue)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-500">Spread</span>
            <span className={`font-mono ${variancePercent > 20 ? 'text-red-500' : 'text-green-500'}`}>
              {variancePercent.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-mono font-medium text-gray-700">{formatNumber(value)}</span>
    </div>
  );
}
