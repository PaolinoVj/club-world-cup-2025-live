// LiveCountdownCard.tsx
'use client'

import { useEffect, useState } from "react"

interface GameData {
  teamA: string
  teamB: string
  dateTime: string
  venue?: string
  day: string
  timeIT: string
  game: string
  result?: string
}

const teamColors: Record<string, string> = {
  "Boston Celtics": "from-green-700 to-green-900",
  "Miami Heat": "from-red-700 to-black",
  "New York Knicks": "from-blue-600 to-orange-600",
  "Philadelphia 76ers": "from-blue-800 to-red-600",
  "Cleveland Cavaliers": "from-yellow-700 to-red-800",
  "Orlando Magic": "from-blue-500 to-gray-800",
  "Milwaukee Bucks": "from-green-900 to-gray-900",
  "Indiana Pacers": "from-yellow-500 to-blue-800",
  "Denver Nuggets": "from-blue-800 to-yellow-900",
  "Los Angeles Lakers": "from-yellow-600 to-purple-800",
  "Minnesota Timberwolves": "from-blue-900 to-green-700",
  "Phoenix Suns": "from-purple-700 to-orange-600",
  "Oklahoma City Thunder": "from-blue-600 to-orange-500",
  "New Orleans Pelicans": "from-blue-800 to-yellow-600",
  "LA Clippers": "from-red-600 to-blue-700",
  "Dallas Mavericks": "from-blue-800 to-gray-600",
  "Golden State Warriors": "from-blue-700 to-yellow-500",
  "Houston Rockets": "from-red-700 to-gray-800",
  "Memphis Grizzlies": "from-blue-900 to-cyan-700",
  "Detroit Pistons": "from-red-700 to-blue-900"
}

const teamLogos: Record<string, string> = {
  "Boston Celtics": "https://loodibee.com/wp-content/uploads/nba-boston-celtics-logo.png",
  "Miami Heat": "https://loodibee.com/wp-content/uploads/nba-miami-heat-logo.png",
  "New York Knicks": "https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo.png",
  "Philadelphia 76ers": "https://loodibee.com/wp-content/uploads/nba-philadelphia-76ers-logo.png",
  "Cleveland Cavaliers": "https://loodibee.com/wp-content/uploads/nba-cleveland-cavaliers-logo.png",
  "Orlando Magic": "https://loodibee.com/wp-content/uploads/nba-orlando-magic-logo.png",
  "Milwaukee Bucks": "https://loodibee.com/wp-content/uploads/nba-milwaukee-bucks-logo.png",
  "Indiana Pacers": "https://loodibee.com/wp-content/uploads/nba-indiana-pacers-logo.png",
  "Denver Nuggets": "https://loodibee.com/wp-content/uploads/nba-denver-nuggets-logo.png",
  "Los Angeles Lakers": "https://loodibee.com/wp-content/uploads/nba-los-angeles-lakers-logo.png",
  "Minnesota Timberwolves": "https://loodibee.com/wp-content/uploads/nba-minnesota-timberwolves-logo.png",
  "Phoenix Suns": "https://loodibee.com/wp-content/uploads/nba-phoenix-suns-logo.png",
  "Oklahoma City Thunder": "https://loodibee.com/wp-content/uploads/nba-oklahoma-city-thunder-logo.png",
  "New Orleans Pelicans": "https://loodibee.com/wp-content/uploads/nba-new-orleans-pelicans-logo.png",
  "LA Clippers": "https://loodibee.com/wp-content/uploads/nba-los-angeles-clippers-logo.png",
  "Dallas Mavericks": "https://loodibee.com/wp-content/uploads/nba-dallas-mavericks-logo.png",
  "Golden State Warriors": "https://loodibee.com/wp-content/uploads/nba-golden-state-warriors-logo.png",
  "Houston Rockets": "https://loodibee.com/wp-content/uploads/nba-houston-rockets-logo.png",
  "Memphis Grizzlies": "https://loodibee.com/wp-content/uploads/nba-memphis-grizzlies-logo.png",
  "Detroit Pistons": "https://loodibee.com/wp-content/uploads/nba-detroit-pistons-logo.png"
}

export default function LiveCountdownCard({ team }: { team: string }) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    async function fetchGame() {
      const res = await fetch(`/api/nba/next-game?team=${team}`)
      const data = await res.json()
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
        setCountdown('In corso o terminata')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      setCountdown(`${days}g ${hours}h ${minutes}m`)
    }, 60000)

    return () => clearInterval(interval)
  }, [gameData])

  if (!gameData) {
    return null
  }

  const gradient = teamColors[gameData.teamA] || 'from-gray-500 to-gray-700'
  const logoA = teamLogos[gameData.teamA]
  const logoB = teamLogos[gameData.teamB]

  return (
    <div className={`p-5 rounded-2xl shadow-lg bg-gradient-to-br ${gradient} text-white flex flex-col items-center`}>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center mb-4">
        <div className="flex flex-col items-center">
          {logoA && <img src={logoA} alt={gameData.teamA} className="w-20 h-20 object-contain" />}
          <div className="font-bold mt-2">{gameData.teamA}</div>
        </div>
        <div className="text-3xl font-bold">VS</div>
        <div className="flex flex-col items-center">
          {logoB && <img src={logoB} alt={gameData.teamB} className="w-20 h-20 object-contain" />}
          <div className="font-bold mt-2">{gameData.teamB}</div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold">{gameData.day} - {gameData.timeIT}</p>
        {gameData.result && (
          <p className="mt-1 text-sm font-bold">Serie: {gameData.result}</p>
        )}
        <p className="text-sm mt-2">{gameData.venue}</p>
        <p className="text-md font-bold mt-2">{countdown}</p>
      </div>
    </div>
  )
}
