'use client';

import { useState, useEffect } from 'react';
import { PetUpdate, NewPet } from '@/types';
import { getCountdownToNextUpdate, formatUpdateType } from '@/lib/weeklyUpdates';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export function WeeklyUpdates() {
  const [latestUpdate, setLatestUpdate] = useState<PetUpdate | null>(null);
  const [upcomingUpdates, setUpcomingUpdates] = useState<PetUpdate[]>([]);
  const [updateHistory, setUpdateHistory] = useState<PetUpdate[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    if (upcomingUpdates.length > 0) {
      const interval = setInterval(() => {
        const newCountdown = getCountdownToNextUpdate(upcomingUpdates[0]);
        setCountdown(newCountdown);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [upcomingUpdates]);

  const fetchUpdates = async () => {
    setIsLoading(true);
    try {
      const [latestRes, upcomingRes, historyRes] = await Promise.all([
        fetch('/api/updates?type=latest'),
        fetch('/api/updates?type=upcoming'),
        fetch('/api/updates?type=history&limit=5'),
      ]);

      const latestData = await latestRes.json();
      const upcomingData = await upcomingRes.json();
      const historyData = await historyRes.json();

      if (latestData.success) setLatestUpdate(latestData.data[0] || null);
      if (upcomingData.success) setUpcomingUpdates(upcomingData.data);
      if (historyData.success) setUpdateHistory(historyData.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12 text-center text-gray-500">
        <p>Loading updates...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Countdown to Next Update */}
      {upcomingUpdates.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Next Update Coming Soon</h3>
              <p className="text-purple-100">{upcomingUpdates[0].title}</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-4xl font-bold">{countdown.days}</div>
                <div className="text-sm text-purple-100">Days</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{countdown.hours}</div>
                <div className="text-sm text-purple-100">Hours</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{countdown.minutes}</div>
                <div className="text-sm text-purple-100">Minutes</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{countdown.seconds}</div>
                <div className="text-sm text-purple-100">Seconds</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Latest Update */}
      {latestUpdate && (
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  {formatUpdateType(latestUpdate.updateType)}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{latestUpdate.title}</h3>
              <p className="text-gray-600 mb-4">{latestUpdate.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(latestUpdate.releaseDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(latestUpdate.createdAt).toLocaleDateString()}
                </div>
              </div>

              {latestUpdate.petsAdded.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">New Pets Added:</h4>
                  <div className="flex flex-wrap gap-2">
                    {latestUpdate.petsAdded.map((pet, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {pet}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {latestUpdate.petsRemoved.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-semibold text-gray-700">Pets Leaving:</h4>
                  <div className="flex flex-wrap gap-2">
                    {latestUpdate.petsRemoved.map((pet, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                      >
                        {pet}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Update History */}
      {updateHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Update History</h3>
          <div className="space-y-4">
            {updateHistory.map((update) => (
              <Card key={update.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">
                        {formatUpdateType(update.updateType)}
                      </span>
                    </div>
                    <h4 className="font-semibold">{update.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(update.releaseDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
