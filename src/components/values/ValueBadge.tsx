'use client';

import { motion } from 'framer-motion';
import { AggregatedValue, Confidence } from '@/types';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ValueBadgeProps {
  value: AggregatedValue;
  showSources?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ValueBadge({ value, showSources = false, size = 'md' }: ValueBadgeProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  const getConfidenceColor = (confidence: Confidence) => {
    switch (confidence) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
    }
  };

  const getVarianceIcon = () => {
    const variance = value.max - value.min;
    const variancePercent = (variance / value.communityValue) * 100;
    
    if (variancePercent < 5) return <Minus className="w-3 h-3" />;
    return <TrendingUp className="w-3 h-3" />;
  };

  return (
    <div className="space-y-2">
      {/* Main Value */}
      <div className={`inline-flex items-center gap-2 ${sizeClasses[size]} bg-gray-900 text-white rounded-lg font-mono font-bold`}>
        <span>{formatNumber(value.communityValue)}</span>
        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(value.confidence)}`} />
      </div>

      {/* Sources Breakdown */}
      {showSources && (
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500">Elvebredd:</span>
            <span className="font-mono font-medium">{formatNumber(value.sources.elvebredd)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500">GG Values:</span>
            <span className="font-mono font-medium">{formatNumber(value.sources.ggvalues)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500">AMTV:</span>
            <span className="font-mono font-medium">{formatNumber(value.sources.amtv)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-200">
            <span className="text-gray-500">Variance:</span>
            <span className="font-mono font-medium flex items-center gap-1">
              {getVarianceIcon()}
              {formatNumber(value.max - value.min)}
            </span>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-xs text-gray-400">
        Updated {new Date(value.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}
