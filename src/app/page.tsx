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

const teamLogos: Record<string, string> = {
  "New York Knicks": "https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo.png",
  "Indiana Pacers": "https://loodibee.com/wp-content/uploads/nba-indiana-pacers-logo.png",
  "Denver Nuggets": "https://loodibee.com/wp-content/uploads/denver-nuggets-logo-symbol.png",
  "Minnesota Timberwolves": "https://loodibee.com/wp-content/uploads/nba-minnesota-timberwolves-logo.png",
  "Oklahoma City Thunder": "https://loodibee.com/wp-content/uploads/nba-oklahoma-city-thunder-logo.png"
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    fetch("/playoffs-2025-extended.json")
      .then((res) => res.json())
      .then((data) => setGames(data))
  }, [])

  const seriesMap: Record<string, { teamA: string; teamB: string; series: string; isLead?: boolean; matchPoint?: boolean; sweep?: boolean }> = {}
  const gamesByDay: Record<string, Game[]> = {}

  function detectMatchPoint(score: string): boolean {
    const m = score.match(/(\d)-(\d)/)
    if (!m) return false
    const [a, b] = [parseInt(m[1]), parseInt(m[2])]
    return a === 3 || b === 3
  }

  function detectSweep(score: string): boolean {
    return /^(3-0|0-3)$/.test(score)
  }

  for (const g of games) {
    const key = `${g.teamA} vs ${g.teamB}`
    if (g.series && !seriesMap[key]) {
      const scoreOnly = g.series.match(/\d+-\d+/)?.[0] || ""
      seriesMap[key] = {
        teamA: g.teamA,
        teamB: g.teamB,
        series: g.series,
        isLead: g.isLead,
        matchPoint: detectMatchPoint(scoreOnly),
        sweep: detectSweep(scoreOnly),
      }
    }
    if (!gamesByDay[g.day]) gamesByDay[g.day] = []
    gamesByDay[g.day].push(g)
  }

  const sortedSeries = Object.entries(seriesMap).sort(([, a], [, b]) => {
    if (a.sweep) return -1
    if (b.sweep) return 1
    if (a.matchPoint && !b.matchPoint) return -1
    if (b.matchPoint && !a.matchPoint) return 1
    return 0
  })

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
              <th className="py-1">Note</th>
            </tr>
          </thead>
          <tbody>
            {sortedSeries.map(([key, serie]) => (
              <tr
                key={key}
                className={`${
                  serie.sweep
                    ? 'bg-pink-100'
                    : serie.matchPoint
                    ? 'bg-orange-100'
                    : ''
                } border-b`}
              >
                <td className="py-1 font-medium text-gray-800 flex items-center gap-2">
                  <img src={teamLogos[serie.teamA]} alt={serie.teamA} className="w-5 h-5" />
                  {serie.teamA} vs
                  <img src={teamLogos[serie.teamB]} alt={serie.teamB} className="w-5 h-5" />
                  {serie.teamB}
                </td>
                <td className="py-1">{serie.series}</td>
                <td className="py-1">
                  {serie.isLead && <span className="text-blue-600 font-semibold mr-2">🔝 LEAD</span>}
                  {serie.matchPoint && <span className="text-orange-500 font-semibold mr-2">🔥 MATCH POINT</span>}
                  {serie.sweep && <span className="text-pink-500 font-semibold">🧹 SWEEP</span>}
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
