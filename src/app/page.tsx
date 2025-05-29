"use client"

import { useEffect, useState } from "react"
import LiveCountdownCard from "@/components/LiveCountdownCard"
import aliasMap from "@/utils/aliasMap"

interface Game {
  teamA: string
  teamB: string
  series?: string
}

const teams = ["thunder", "pacers", "knicks", "timberwolves"]

export default function HomePage() {
  const [seriesMap, setSeriesMap] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch("/playoffs-2025-extended.json")
      .then((res) => res.json())
      .then((games: Game[]) => {
        const currentSeries: Record<string, string> = {}
        games.forEach((g) => {
          if (g.series) {
            const matchup = [g.teamA, g.teamB].sort().join("_vs_")
            currentSeries[matchup] = g.series
          }
        })
        setSeriesMap(currentSeries)
      })
  }, [])

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

      <div className="w-full max-w-6xl grid gap-6 grid-cols-1 sm:grid-cols-2">
        {teams.map((team) => {
          const fullName = aliasMap[team] || team
          const opponentEntry = Object.entries(seriesMap).find(([key]) => key.includes(fullName))

          let seriesLabel = ""
          let progress = 0

          if (opponentEntry) {
            seriesLabel = opponentEntry[1]
            const match = seriesLabel.match(/(\w+)\s+leads\s+(\d+)-(\d+)/i)
            if (match) {
              const winsA = parseInt(match[2], 10)
              const winsB = parseInt(match[3], 10)
              progress = (winsA / 4) * 100
            }
          }

          return (
            <div key={team} className="flex flex-col">
              {seriesLabel && (
                <div className="text-sm text-gray-600 font-semibold mb-1 text-center">
                  Serie: {seriesLabel}
                  <div className="w-full h-1 bg-gray-300 rounded overflow-hidden mt-1">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <LiveCountdownCard team={team} />
            </div>
          )
        })}
      </div>
    </main>
  )
}
