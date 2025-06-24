'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import LiveCountdownCard from '@/components/LiveCountdownCard';

interface Match {
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
  phase: string;
  group?: string;
  status: 'upcoming' | 'live' | 'finished';
  result?: string;
}

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/data/matches.json')
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, []);

  const upcoming = matches.find((m) => m.status === 'upcoming');
  const recent = matches.filter((m) => m.status === 'finished').slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/globe.svg"
          alt="Club World Cup"
          width={80}
          height={80}
          className="mb-2 drop-shadow-md"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          Club World Cup 2025
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Prossima partita in programma
        </p>
      </div>

      {upcoming && (
        <div className="w-full max-w-2xl mb-10">
          <LiveCountdownCard date={upcoming.date} time={upcoming.time_italy} />
        </div>
      )}

      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#607D8B' }}>
          Ultime partite concluse
        </h2>
        <div className="text-center mb-4">
          <button onClick={() => setShowModal(true)} className="text-blue-600 underline text-sm">
            Vedi tutte
          </button>
        </div>
        <ul className="space-y-2">
          {recent.map((match, i) => (
            <li
              key={i}
              className="bg-white rounded shadow p-4 text-sm text-center"
              style={{ color: '#607D8B' }}
            >
              <strong>{match.home_team.name}</strong> vs <strong>{match.away_team.name}</strong> –{' '}
              <span className="text-green-600 font-medium">{match.result}</span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: '#607D8B' }}>
                Tutte le partite concluse
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 hover:text-red-700"
              >
                Chiudi
              </button>
            </div>
            <ul className="space-y-2">
              {matches
                .filter((m) => m.status === 'finished')
                .map((match, i) => (
                  <li
                    key={i}
                    className="bg-white rounded shadow p-3 text-sm text-center"
                    style={{ color: '#607D8B' }}
                  >
                    <strong>{match.home_team.name}</strong> vs <strong>{match.away_team.name}</strong> –{' '}
                    <span className="text-green-600 font-medium">{match.result}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
