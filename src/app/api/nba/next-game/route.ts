import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import aliasMap from '@/utils/aliasMap'

interface Game {
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
    const allGames: Game[] = JSON.parse(fileContent)

    // Filtra le partite per la squadra indicata
    const filtered = allGames.filter(
      (game: Game) =>
        game.teamA.toLowerCase() === teamParam.toLowerCase() ||
        game.teamB.toLowerCase() === teamParam.toLowerCase()
    )

    // Trova la prossima partita programmata o in corso
    const nextGame: Game | undefined = filtered.find(
      (g: Game) => g.status === 'programmata' || g.status === 'in corso'
    )

    if (!nextGame) {
      return NextResponse.json({ error: 'Nessuna partita trovata. Verifica il nome della squadra o la data.' }, { status: 404 })
    }

    return NextResponse.json({
      teamA: nextGame.teamA,
      teamB: nextGame.teamB,
      dateTime: nextGame.dateTime,
      venue: nextGame.venue || 'TBD',
      day: nextGame.day,
      timeIT: nextGame.timeIT,
      game: nextGame.game,
      result: nextGame.result || undefined,
      status: nextGame.status || undefined,
      series: nextGame.series || undefined,
      isLead: nextGame.isLead || undefined,
      isElimination: nextGame.isElimination || undefined,
      winner: nextGame.winner || undefined
    })
  } catch (err) {
    console.error("Errore durante il recupero file playoff:", err)
    return NextResponse.json({ error: 'Errore durante il recupero file playoff' }, { status: 500 })
  }
}
