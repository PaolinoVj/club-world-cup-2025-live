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
  "Denver Nuggets": "from-blue-800 to-burgundy-800",
  "Los Angeles Lakers": "from-yellow-600 to-purple-800",
  "Minnesota Timberwolves": "from-blue-900 to-green-700",
  "Phoenix Suns": "from-purple-700 to-orange-600",
  "Oklahoma City Thunder": "from-blue-600 to-orange-500",
  "New Orleans Pelicans": "from-navy-800 to-gold-600",
  "LA Clippers": "from-red-600 to-blue-700",
  "Dallas Mavericks": "from-blue-800 to-silver-600"
}

export default function LiveCountdownCard({ team }: { team: string }) {
  const [data, setData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/nba/next-game?team=${encodeURIComponent(team)}`)
        const json = await res.json()

        if (!res.ok) throw new Error(json.error || "Errore nella richiesta")

        setData(json as GameData)
        setLoading(false)

        const target = new Date(json.dateTime).getTime()

        const interval = setInterval(() => {
          const now = new Date().getTime()
          const distance = target - now

          if (distance < 0) {
            setTimeLeft("In corso o terminata")
            clearInterval(interval)
            return
          }

          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)
          const days = Math.floor(distance / (1000 * 60 * 60 * 24))

          setTimeLeft(`${days > 0 ? days + 'g ' : ''}${hours}h ${minutes}m ${seconds}s`)
        }, 1000)

        return () => clearInterval(interval)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Errore sconosciuto'
        setError(message)
        setLoading(false)
      }
    }

    fetchData()
  }, [team])

  if (loading) return <div className="text-center">Caricamento partita di {team}...</div>
  if (error) return <div className="text-red-500 text-center">Errore: {error}</div>
  if (!data) return null

  const gradient = teamColors[data.teamA] || teamColors[data.teamB] || "from-gray-800 to-gray-900"

  return (
    <div className={`bg-gradient-to-br ${gradient} border shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto flex flex-col gap-4 text-center text-white animate-fade-in`}>
      <h2 className="text-xl font-semibold mb-2">{data.game} – {data.day}</h2>

      <div className="flex justify-between items-center text-white">
        <div className="flex-1 text-sm font-bold text-left">{data.teamA}</div>
        <div className="text-lg font-bold text-yellow-300 animate-pulse">{timeLeft}</div>
        <div className="flex-1 text-sm font-bold text-right">{data.teamB}</div>
      </div>

      <div className="text-sm mt-2">
        🕒 {data.timeIT} <span className="text-xs italic">(ora italiana)</span>
      </div>
      <div className="text-xs text-gray-200">🏟 {data.venue}</div>
    </div>
  )
}
