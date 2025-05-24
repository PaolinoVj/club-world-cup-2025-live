'use client'

import { useEffect, useState } from "react"
import Image from "next/image"

export interface GameData {
  teamA: string
  teamB: string
  dateTime: string
  venue?: string
  day: string
  timeIT: string
  game: string
  result?: string
  status?: string
  series?: string
  isLead?: boolean
  isElimination?: boolean
  winner?: string
}

const teamSolidColors: Record<string, string> = {
  "New York Knicks": "bg-blue-700",
  "Indiana Pacers": "bg-yellow-600",
  "Denver Nuggets": "bg-blue-800",
  "Minnesota Timberwolves": "bg-teal-800",
  "Oklahoma City Thunder": "bg-sky-600"
}

const teamLogos: Record<string, string> = {
  "New York Knicks": "https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo.png",
  "Indiana Pacers": "https://loodibee.com/wp-content/uploads/nba-indiana-pacers-logo.png",
  "Denver Nuggets": "https://loodibee.com/wp-content/uploads/denver-nuggets-logo-symbol.png",
  "Minnesota Timberwolves": "https://loodibee.com/wp-content/uploads/nba-minnesota-timberwolves-logo.png",
  "Oklahoma City Thunder": "https://loodibee.com/wp-content/uploads/nba-oklahoma-city-thunder-logo.png"
}

const teamNameMapping: Record<string, string> = {
  "Knicks": "New York Knicks",
  "Nuggets": "Denver Nuggets",
  "Pacers": "Indiana Pacers",
  "Thunder": "Oklahoma City Thunder",
  "Wolves": "Minnesota Timberwolves",
  "Timberwolves": "Minnesota Timberwolves"
}

function mapTeamName(apiTeamName: string): string {
  return teamNameMapping[apiTeamName] || apiTeamName
}

export { teamSolidColors, teamLogos, mapTeamName }

export default function LiveCountdownCard({ team }: { team: string }) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    async function fetchGame() {
      const res = await fetch(`/api/nba/next-game?team=${team}`)
      const data = await res.json()
      if (!data || data.error) return
      setGameData(data)
    }
    fetchGame()
  }, [team])

  useEffect(() => {
    if (!gameData) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const gameTime = new Date(gameData.dateTime).getTime()
      const distance = gameTime - now

      if (distance < 0) {
        setCountdown('LIVE')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      setCountdown(`${days}g ${hours}h ${minutes}m`)
    }, 60000)

    return () => clearInterval(interval)
  }, [gameData])

  if (!gameData) return null

  const mappedTeamA = mapTeamName(gameData.teamA)
  const mappedTeamB = mapTeamName(gameData.teamB)
  const bgColorA = teamSolidColors[mappedTeamA] || 'bg-gray-600'
  const bgColorB = teamSolidColors[mappedTeamB] || 'bg-gray-600'
  const logoA = teamLogos[mappedTeamA]
  const logoB = teamLogos[mappedTeamB]

  return (
    <div className="rounded-xl shadow-md text-white w-full flex flex-col sm:flex-row overflow-hidden mb-4">
      <div className={`flex-1 flex flex-col items-center justify-center p-4 ${bgColorA}`}>
        <Image src={logoA} alt={mappedTeamA} width={80} height={80} className="mb-2 sm:w-20 sm:h-20" />
        <div className="text-base sm:text-xl font-semibold text-center leading-tight">{mappedTeamA}</div>
        {gameData.winner === gameData.teamA && <div className="text-xs font-bold text-green-400 mt-1">🏆 Vincitore</div>}
      </div>

      <div className="bg-black flex flex-col justify-center items-center px-2 py-4 w-full sm:w-56 text-center">
        <div className="text-xs uppercase tracking-widest text-gray-400">{gameData.game}</div>
        <div className="text-sm mt-1">{gameData.day} - {gameData.timeIT}</div>
        <div className="text-xs text-gray-400 mt-1 leading-tight">{gameData.venue}</div>
        <div className="text-sm text-yellow-300 mt-2 font-medium">
          {countdown === 'LIVE' ? <span className="text-red-400 animate-pulse">LIVE</span> : countdown}
        </div>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(gameData.teamA + ' vs ' + gameData.teamB)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-blue-400 underline text-xs"
        >
          Info & risultati
        </a>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center p-4 ${bgColorB}`}>
        <Image src={logoB} alt={mappedTeamB} width={80} height={80} className="mb-2 sm:w-20 sm:h-20" />
        <div className="text-base sm:text-xl font-semibold text-center leading-tight">{mappedTeamB}</div>
        {gameData.winner === gameData.teamB && <div className="text-xs font-bold text-green-400 mt-1">🏆 Vincitore</div>}
      </div>
    </div>
  )
}
