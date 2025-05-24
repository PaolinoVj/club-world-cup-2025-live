import { useEffect, useState } from "react"
import LiveCountdownCard from "@/components/LiveCountdownCard"

interface Game {
  teamA: string
  teamB: string
  day: string
  dateTime: string
  series?: string
  isLead?: boolean
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    fetch("/playoffs-2025-extended.json")
      .then((res) => res.json())
      .then((data) => setGames(data))
  }, [])

  const seriesMap: Record<string, { teamA: string; teamB: string; series: string; isLead?: boolean }> = {}
  const gamesByDay: Record<string, Game[]> = {}

  for (const g of games) {
    const key = `${g.teamA} vs ${g.teamB}`
    if (g.series) {
      seriesMap[key] = {
        teamA: g.teamA,
        teamB: g.teamB,
        series: g.series,
        isLead: g.isLead,
      }
    }
    if (!gamesByDay[g.day]) gamesByDay[g.day] = []
    gamesByDay[g.day].push(g)
  }

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
          Serie in corso e calendario delle prossime partite
        </p>
      </div>

      {/* TABELLA SERIE */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow mb-10">
        <h2 className="text-lg font-bold mb-2 text-gray-700">Stato delle serie</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b">
              <th className="py-1">Matchup</th>
              <th className="py-1">Serie</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(seriesMap).map(([key, serie]) => (
              <tr key={key} className="border-b">
                <td className="py-1 font-medium text-gray-800">{serie.teamA} vs {serie.teamB}</td>
                <td className="py-1">
                  {serie.series} {serie.isLead && <span className="text-blue-600 font-bold">(lead)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS PER GIORNO */}
      <div className="w-full max-w-6xl">
        {Object.entries(gamesByDay).map(([day, matches]) => (
          <div key={day} className="mb-10">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-1">{day}</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {matches.map((m, i) => (
                <LiveCountdownCard key={`${m.teamA}-${m.teamB}-${i}`} team={m.teamA.toLowerCase()} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
