"use client";

import { useEffect, useState } from "react";
import LiveCountdownCard from "@/components/LiveCountdownCard";
import SeriesTable from "@/components/SeriesTable";

const teams = ["thunder", "timberwolves", "knicks", "pacers"];

interface Game {
  teamA: string;
  teamB: string;
  series?: string;
  winner?: string;
}

export default function HomePage() {
  const [seriesData, setSeriesData] = useState<Game[]>([]);

  useEffect(() => {
    async function fetchSeries() {
      try {
        const res = await fetch("/playoffs-2025-extended.json");
        const data = await res.json();
        const finalSeries = data.filter(
          (game: Game) =>
            teams.includes(game.teamA.toLowerCase()) &&
            teams.includes(game.teamB.toLowerCase()) &&
            game.series
        );
        setSeriesData(finalSeries);
      } catch (err) {
        console.error("Errore nel caricamento dei dati playoff:", err);
      }
    }
    fetchSeries();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://loodibee.com/wp-content/uploads/nba-logo-transparent.png"
          alt="NBA Logo"
          className="w-20 mb-2 drop-shadow-md"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          NBA Playoff 2025
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Prossime partite delle squadre finaliste
        </p>
      </div>

      <div className="w-full max-w-4xl mb-6">
        <SeriesTable seriesGames={seriesData} />
      </div>

      <div className="w-full max-w-6xl grid gap-6 grid-cols-1 sm:grid-cols-2">
        {teams.map((team) => (
          <LiveCountdownCard key={team} team={team} />
        ))}
      </div>
    </main>
  );
}
