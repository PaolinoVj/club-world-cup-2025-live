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
  "thunder": "Oklahoma City Thunder",
  "grizzlies": "Memphis Grizzlies",
  "rockets": "Houston Rockets",
  "pistons": "Detroit Pistons"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let teamParam = searchParams.get('team')?.toLowerCase()

  if (!teamParam) {
    return NextResponse.json({ error: 'Parametro team mancante' }, { status: 400 })
  }

  teamParam = aliasMap[teamParam] || teamParam

  try {
    const filePath = path.join(process.cwd(), 'public', 'playoffs-2025-extended.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const allGames = JSON.parse(fileContent)

    const now = new Date().getTime()

    const filtered = allGames.filter((game: any) =>
      (game.teamA.toLowerCase() === teamParam.toLowerCase() ||
        game.teamB.toLowerCase() === teamParam.toLowerCase()) &&
      ['programmata', 'in corso'].includes(game.status || '')
    )

    if (filtered.length === 0) {
      return NextResponse.json({ error: 'Nessuna partita imminente trovata. Verifica il nome della squadra o la data.' }, { status: 404 })
    }

    const game = filtered.sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0]

    return NextResponse.json({
      teamA: game.teamA,
      teamB: game.teamB,
      dateTime: game.dateTime,
      venue: game.venue || 'TBD',
      day: game.day,
      timeIT: game.timeIT,
      game: game.game,
      result: game.result || undefined,
      status: game.status || undefined,
      series: game.series || undefined,
      isLead: game.isLead || undefined,
      isElimination: game.isElimination || undefined,
      winner: game.winner || undefined
    })
  } catch (err) {
    console.error("Errore durante il recupero file playoff:", err)
    return NextResponse.json({ error: 'Errore durante il recupero file playoff' }, { status: 500 })
  }
}
