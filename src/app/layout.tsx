'use client';

import { useEffect, useState } from "react";
// import Image from "next/image";
import LiveCountdownCard from "@/components/LiveCountdownCard";

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
  status: "upcoming" | "live" | "finished";
  result?: string;
}

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("/data/matches.json")
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, []);

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Club World Cup 2025 – Partite</h1>

      {matches.length === 0 && <p>Caricamento in corso...</p>}

      {matches.map((match, i) => (
        <div
          key={i}
          className="p-4 rounded-xl shadow bg-white border flex flex-col gap-2"
        >
          <div className="text-sm text-gray-600">
            {match.phase} {match.group ? `– Gruppo ${match.group}` : ""}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">{match.home_team.name}</span>
            <span>vs</span>
            <span className="font-semibold">{match.away_team.name}</span>
          </div>

          <div className="text-sm text-gray-700">
            {match.date} – {match.time_italy} @ {match.stadium}
          </div>

          {match.status === "upcoming" && (
            <LiveCountdownCard date={match.date} time={match.time_italy} />
          )}

          {match.status === "finished" && (
            <div className="text-green-700 font-medium">Risultato: {match.result}</div>
          )}

          {match.status === "live" && (
            <div className="text-red-600 font-bold animate-pulse">In corso!</div>
          )}
        </div>
      ))}
    </main>
  );
}
