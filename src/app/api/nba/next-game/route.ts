import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

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
  "thunder": "Oklahoma City Thunder"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let teamParam = searchParams.get('team')?.toLowerCase()

  if (!teamParam) {
    return NextResponse.json({ error: 'Parametro team mancante' }, { status: 400 })
  }

  teamParam = aliasMap[teamParam] || teamParam

  try {
    const filePath = path.join(process.cwd(), 'public', 'mock-playoff-games-real-it.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const allGames = JSON.parse(fileContent)

    const now = new Date().getTime()

    const filtered = allGames.filter((game: any) => {
      return (
        game.teamA.toLowerCase() === teamParam.toLowerCase() ||
        game.teamB.toLowerCase() === teamParam.toLowerCase()
      )
    })

    const upcoming = filtered
      .filter((g: any) => new Date(g.dateTime).getTime() > now)
      .sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

    if (upcoming.length === 0) {
      return NextResponse.json({ error: 'Nessuna partita imminente trovata' }, { status: 404 })
    }

    const game = upcoming[0]
    const gameDateItaly = new Date(game.dateTime) // già orario italiano nel file json

    return NextResponse.json({
      teamA: game.teamA,
      teamB: game.teamB,
      dateTime: gameDateItaly.toISOString(),
      venue: game.venue || 'TBD'
    })
  } catch (err) {
    return NextResponse.json({ error: 'Errore durante il recupero file mock' }, { status: 500 })
  }
}
