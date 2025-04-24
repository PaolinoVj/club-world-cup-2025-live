'use client'

import { useEffect, useState } from "react"

interface GameData {
  teamA: string
  teamALogo?: string
  teamB: string
  teamBLogo?: string
  dateTime: string
  venue?: string
}

const getSportsLogosUrl = (team: string) => {
  const map: Record<string, string> = {
    "boston celtics": "Boston_Celtics",
    "brooklyn nets": "Brooklyn_Nets",
    "chicago bulls": "Chicago_Bulls",
    "cleveland cavaliers": "Cleveland_Cavaliers",
    "dallas mavericks": "Dallas_Mavericks",
    "denver nuggets": "Denver_Nuggets",
    "golden state warriors": "Golden_State_Warriors",
    "indiana pacers": "Indiana_Pacers",
    "la clippers": "Los_Angeles_Clippers",
    "los angeles lakers": "Los_Angeles_Lakers",
    "memphis grizzlies": "Memphis_Grizzlies",
    "miami heat": "Miami_Heat",
    "milwaukee bucks": "Milwaukee_Bucks",
    "minnesota timberwolves": "Minnesota_Timberwolves",
    "new orleans pelicans": "New_Orleans_Pelicans",
    "new york knicks": "New_York_Knicks",
    "oklahoma city thunder": "Oklahoma_City_Thunder",
    "orlando magic": "Orlando_Magic",
    "philadelphia 76ers": "Philadelphia_76ers",
    "phoenix suns": "Phoenix_Suns",
    "sacramento kings": "Sacramento_Kings",
    "toronto raptors": "Toronto_Raptors",
    "washington wizards": "Washington_Wizards"
  }

  const key = team.toLowerCase()
  return map[key]
    ? `https://loodibee.com/wp-content/uploads/nba-${map[key].toLowerCase().replace(/_/g, '-')}-logo.png`
    : 'https://loodibee.com/wp-content/uploads/nba-logo.png'
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

        json.teamALogo = getSportsLogosUrl(json.teamA)
        json.teamBLogo = getSportsLogosUrl(json.teamB)

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

  const fallbackLogo = 'https://loodibee.com/wp-content/uploads/nba-logo.png'

  if (loading) return <div className="text-center">Caricamento partita di {team}...</div>
  if (error) return <div className="text-red-500 text-center">Errore: {error}</div>
  if (!data) return null

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto flex flex-col gap-4 text-center relative text-white animate-fade-in">
      <h2 className="text-xl font-semibold text-white mb-4">Prossima partita</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-6">
        <div className="flex flex-col items-center">
          <img src={data.teamALogo || fallbackLogo} alt={data.teamA} className="w-16 h-16 object-contain" />
          <span className="mt-2 font-bold text-sm text-white text-center leading-tight">{data.teamA}</span>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-yellow-300 animate-pulse">{timeLeft}</div>
          <div className="text-sm text-gray-200">
            🗓 {new Date(data.dateTime).toLocaleDateString("it-IT")} – 🕒 {new Date(data.dateTime).toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' })} <span className="text-xs italic">(ora italiana)</span>
          </div>
          {data.venue && (
            <div className="text-xs text-gray-400 mt-1">🏟 {data.venue}</div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <img src={data.teamBLogo || fallbackLogo} alt={data.teamB} className="w-16 h-16 object-contain" />
          <span className="mt-2 font-bold text-sm text-white text-center leading-tight">{data.teamB}</span>
        </div>
      </div>
    </div>
  )
}
