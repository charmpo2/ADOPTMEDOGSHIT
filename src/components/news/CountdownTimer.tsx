'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const calculateNextUpdate = () => {
      const now = new Date();
      const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      
      // Find next Friday at 11 AM ET
      const nextFriday = new Date(etNow);
      nextFriday.setDate(etNow.getDate() + ((5 - etNow.getDay() + 7) % 7));
      nextFriday.setHours(11, 0, 0, 0);
      
      // If it's already past Friday 11 AM, go to next week
      if (etNow > nextFriday) {
        nextFriday.setDate(nextFriday.getDate() + 7);
      }
      
      setNextUpdate(nextFriday);
      return nextFriday;
    };

    const target = calculateNextUpdate();

    const updateCountdown = () => {
      const now = new Date();
      const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const diff = target.getTime() - etNow.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Reset when countdown reaches zero
        calculateNextUpdate();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    }) + ' ET';
  };

  const TimeBlock = ({ value, label }: { value: number; label: string }) => {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[80px] text-center">
        <div className="text-3xl font-bold font-mono">
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs text-blue-200 uppercase tracking-wider">{label}</div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/20 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Next Update Countdown</h3>
          <p className="text-blue-200 text-sm flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(nextUpdate)}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>

      <p className="text-center text-blue-200 text-sm mt-4">
        Adopt Me typically updates every Friday at 11:00 AM ET
      </p>
    </div>
  );
}
