import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

interface Game {
  teamA: string
  teamB: string
  dateTime: string
  venue?: string
  day: string
  timeIT: string
  game: string
}

const aliasMap: Record<string, string> = {
  "warriors": "Golden State Warriors",
  "lakers": "Los Angeles Lakers",
  "celtics": "Boston Celtics",
  "sixers": "Philadelphia 76ers",
  "76ers": "Philadelphia 76ers",
  "knicks": "New York Knicks",
  "nuggets": "Denver Nuggets",
  "clippers": "LA Clippers",
  "mavericks": "Dallas Mavericks",
  "bucks": "Milwaukee Bucks",
  "cavaliers": "Cleveland Cavaliers",
  "magic": "Orlando Magic",
  "heat": "Miami Heat",
  "wolves": "Minnesota Timberwolves",
  "timberwolves": "Minnesota Timberwolves",
  "suns": "Phoenix Suns",
  "pelicans": "New Orleans Pelicans",
  "pacers": "Indiana Pacers",
  "thunder": "Oklahoma City Thunder",
  "golden state": "Golden State Warriors",
  "golden state warriors": "Golden State Warriors",

}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let teamParam = searchParams.get('team')?.toLowerCase()

  if (!teamParam) {
    return NextResponse.json({ error: 'Parametro team mancante' }, { status: 400 })
  }

  teamParam = aliasMap[teamParam] || teamParam

  try {
    const filePath = path.join(process.cwd(), 'public', 'playoffs-2025-real-round1.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const allGames: Game[] = JSON.parse(fileContent)

    const now = new Date().getTime()

    const filtered = allGames.filter((game) =>
      game.teamA.toLowerCase() === teamParam.toLowerCase() ||
      game.teamB.toLowerCase() === teamParam.toLowerCase()
    )

    const upcoming = filtered
      .filter((g) => new Date(g.dateTime).getTime() > now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

    if (upcoming.length === 0) {
      return NextResponse.json({ error: 'Nessuna partita imminente trovata' }, { status: 404 })
    }

    const game = upcoming[0]

    return NextResponse.json({
      teamA: game.teamA,
      teamB: game.teamB,
      dateTime: game.dateTime,
      venue: game.venue || 'TBD',
      day: game.day,
      timeIT: game.timeIT,
      game: game.game
    })
  } catch {
    return NextResponse.json({ error: 'Errore durante il recupero file playoff' }, { status: 500 })
  }
}
