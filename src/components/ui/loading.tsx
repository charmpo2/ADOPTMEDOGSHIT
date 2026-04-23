'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

interface LoadingCardProps {
  text?: string;
}

export function LoadingCard({ text = 'Loading...' }: LoadingCardProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">{text}</p>
      </div>
    </Card>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className || ''}`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
