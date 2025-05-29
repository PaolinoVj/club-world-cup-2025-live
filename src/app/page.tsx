"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import LiveCountdownCard from "@/components/LiveCountdownCard"
import aliasMap from "@/utils/aliasMap"

interface Game {
  teamA: string
  teamB: string
  dateTime: string
  status?: string
  series?: string
  game?: string
  result?: string
}

const teams = ["thunder", "pacers", "knicks", "timberwolves"]

export default function HomePage() {
  const [seriesMap, setSeriesMap] = useState<Record<string, string>>({})
  const [pastGames, setPastGames] = useState<Game[]>([])
  const [showModal, setShowModal] = useState(false)
  const [highlightedTeam, setHighlightedTeam] = useState<string | null>(null)

  useEffect(() => {
    fetch("/playoffs-2025-extended.json")
      .then((res) => res.json())
      .then((games: Game[]) => {
        const currentSeries: Record<string, string> = {}
        const playedGames: Game[] = []
        const now = Date.now()

        let nextGame: Game | null = null

        games.forEach((g) => {
          if (g.series) {
            const matchup = [g.teamA, g.teamB].sort().join("_vs_")
            currentSeries[matchup] = g.series
          }

          if (g.status === "conclusa") {
            playedGames.push(g)
          }

          const gameTime = new Date(g.dateTime).getTime()
          if ((g.status === "programmata" || g.status === "in corso") && gameTime > now) {
            if (!nextGame || gameTime < new Date(nextGame.dateTime).getTime()) {
              nextGame = g
            }
          }
        })

        setSeriesMap(currentSeries)
        setPastGames(playedGames.reverse())
        if (nextGame) setHighlightedTeam(nextGame.teamA)
      })
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <Image src="https://loodibee.com/wp-content/uploads/nba-logo-transparent.png" alt="NBA Logo" width={80} height={80} className="mb-2 drop-shadow-md" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          NBA Playoff 2025
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Prossima partita delle squadre finaliste
        </p>
      </div>

      {highlightedTeam && (
        <div className="w-full max-w-2xl mb-10">
          <LiveCountdownCard team={highlightedTeam} highlighted={true} />
        </div>
      )}

      <div className="w-full max-w-6xl grid gap-6 grid-cols-1 sm:grid-cols-2 mb-10">
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
              progress = (winsA / 4) * 100
            }
          }

          return (
            <div key={team} className="flex flex-col">
              {seriesLabel && (
                <div className="text-sm font-semibold mb-1 text-center" style={{ color: "#607D8B" }}>
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

      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: "#607D8B" }}>Ultime partite concluse</h2>
        <div className="text-center mb-4">
          <button onClick={() => setShowModal(true)} className="text-blue-600 underline text-sm">Vedi tutte</button>
        </div>
        <ul className="space-y-2">
          {pastGames.slice(0, 5).map((g, i) => (
            <li key={i} className="bg-white rounded shadow p-4 text-sm text-center" style={{ color: "#607D8B" }}>
              <strong>{g.teamA}</strong> vs <strong>{g.teamB}</strong> - {g.game} → <span className="text-green-600 font-medium">{g.result}</span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#607D8B" }}>Tutte le partite concluse</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 hover:text-red-700"
              >
                Chiudi
              </button>
            </div>
            <ul className="space-y-2">
              {pastGames.map((g, i) => (
                <li key={i} className="bg-white rounded shadow p-3 text-sm text-center" style={{ color: "#607D8B" }}>
                  <span className="inline-flex items-center justify-center">
                    <Image
                      src={`https://loodibee.com/wp-content/uploads/nba-${g.teamA.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                      alt={g.teamA}
                      width={24}
                      height={24}
                      className="w-6 h-6 mr-2"
                    />
                    <strong>{g.teamA}</strong>
                  </span>
                  vs
                  <span className="inline-flex items-center justify-center ml-2">
                    <Image
                      src={`https://loodibee.com/wp-content/uploads/nba-${g.teamB.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                      alt={g.teamB}
                      width={24}
                      height={24}
                      className="w-6 h-6 mr-2"
                    />
                    <strong>{g.teamB}</strong>
                  </span>
                  - {g.game} →
                  <span className="text-green-600 font-medium"> {g.result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
