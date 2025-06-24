'use client';

import { useEffect, useState } from 'react';

export interface MatchData {
  home_team: {
    id: number;
    name: string;
    slug: string;
  };
  away_team: {
    id: number;
    name: string;
    slug: string;
  };
  date: string;
  time_italy: string;
  stadium: string;
  status: 'upcoming' | 'live' | 'finished';
}

export default function LiveCountdownCard({ date, time }: { date: string; time: string }) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const [hours, minutes] = time.split(':').map(Number);
      const [year, month, day] = date.split('-').map(Number);
      const gameTime = new Date(year, month - 1, day, hours, minutes).getTime();
      const distance = gameTime - now;

      if (distance < 0) {
        setCountdown('LIVE');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(`${days}g ${hoursLeft}h ${minutesLeft}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [date, time]);

  return (
    <div className="text-sm text-yellow-500 font-semibold">
      {countdown === 'LIVE' ? <span className="text-red-500 animate-pulse">LIVE</span> : `Inizia tra ${countdown}`}
    </div>
  );
}
