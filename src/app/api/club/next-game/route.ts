import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import aliasMap from '@/utils/aliasMap'

interface Team {
  id: number
  name: string
  slug: string
}

interface Match {
  home_team: Team
  away_team: Team
  date: string // YYYY-MM-DD
  time_italy: string // HH:mm
  stadium: string
  phase: string
  group?: string
  status: string
  result?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let teamParam = searchParams.get('team')?.toLowerCase()

  if (!teamParam) {
    return NextResponse.json({ error: 'Parametro team mancante' }, { status: 400 })
  }

  teamParam = aliasMap[teamParam] || teamParam

  try {
    const filePath = path.join(process.cwd(), 'public', 'matches.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const allMatches: Match[] = JSON.parse(fileContent)

    const now = new Date().getTime()

    const futureMatches = allMatches
      .filter((match: Match) => {
        const isTeamInMatch =
          match.home_team.name.toLowerCase() === teamParam ||
          match.away_team.name.toLowerCase() === teamParam

        const matchDateTime = new Date(`${match.date}T${match.time_italy}:00`).getTime()
        return isTeamInMatch && matchDateTime > now
      })
      .sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.time_italy}:00`).getTime()
        const timeB = new Date(`${b.date}T${b.time_italy}:00`).getTime()
        return timeA - timeB
      })

    if (futureMatches.length === 0) {
      return NextResponse.json({ error: 'Nessuna partita futura trovata per questa squadra.' }, { status: 404 })
    }

    const nextMatch = futureMatches[0]

    return NextResponse.json({
      teamA: nextMatch.home_team.name,
      teamB: nextMatch.away_team.name,
      dateTime: `${nextMatch.date}T${nextMatch.time_italy}:00`,
      venue: nextMatch.stadium,
      day: formatItalianDay(nextMatch.date),
      timeIT: nextMatch.time_italy,
      game: `${nextMatch.phase}${nextMatch.group ? ` - Gruppo ${nextMatch.group}` : ''}`,
      result: nextMatch.result || undefined,
      status: nextMatch.status || undefined
    })
  } catch (err) {
    console.error("Errore durante il recupero file matches.json:", err)
    return NextResponse.json({ error: 'Errore durante il recupero file delle partite' }, { status: 500 })
  }
}

function formatItalianDay(dateStr: string): string {
  const giorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  const mesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
  const d = new Date(dateStr)
  return `${giorni[d.getDay()]} ${d.getDate().toString().padStart(2, '0')} ${mesi[d.getMonth()]}`
}
