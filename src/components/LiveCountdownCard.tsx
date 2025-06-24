'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import clubs from '\public\data\cwc_clubs.json'

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

export default function LiveCountdownCard({ team, highlighted = false }: { team: string; highlighted?: boolean }) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    async function fetchGame() {
      const res = await fetch(`/api/club/next-game?team=${team}`)
      const data: unknown = await res.json()
      if (!data || typeof data !== 'object' || !('teamA' in data)) return
      setGameData(data as GameData)
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

  const logoA = clubs[gameData.teamA]?.logo || '/default-logo.png'
  const logoB = clubs[gameData.teamB]?.logo || '/default-logo.png'

  return (
    <div className={`rounded-xl shadow-md text-white w-full flex flex-col sm:flex-row overflow-hidden mb-4 ${highlighted ? 'ring-4 ring-yellow-400' : ''}`}>
      <div className={`flex-1 flex flex-col items-center justify-center p-4 bg-neutral-700`}>
        <Image src={logoA} alt={gameData.teamA} width={80} height={80} className="mb-2" />
        <div className="text-base sm:text-xl font-semibold text-center leading-tight text-[#607D8B]">{gameData.teamA}</div>
        {gameData.winner === gameData.teamA && <div className="text-xs font-bold text-green-400 mt-1">🏆 Vincitore</div>}
      </div>

      <div className="bg-black flex flex-col justify-center items-center px-2 py-4 w-full sm:w-56 text-center">
        <div className="text-xs uppercase tracking-widest text-[#607D8B]">{gameData.game}</div>
        {gameData.isElimination && <div className="text-xs font-bold text-red-500 uppercase animate-pulse mt-1">ELIMINATION GAME</div>}
        <div className="text-sm mt-1 text-[#607D8B]">{gameData.day} - {gameData.timeIT}</div>
        <div className="text-xs text-[#607D8B] mt-1 leading-tight">{gameData.venue}</div>
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

      <div className={`flex-1 flex flex-col items-center justify-center p-4 bg-neutral-700`}>
        <Image src={logoB} alt={gameData.teamB} width={80} height={80} className="mb-2" />
        <div className="text-base sm:text-xl font-semibold text-center leading-tight text-[#607D8B]">{gameData.teamB}</div>
        {gameData.winner === gameData.teamB && <div className="text-xs font-bold text-green-400 mt-1">🏆 Vincitore</div>}
      </div>
    </div>
  )
}
