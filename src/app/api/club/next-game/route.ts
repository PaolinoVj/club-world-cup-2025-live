import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import aliasMap from '@/utils/aliasMap';

interface Game {
  teamA: string;
  teamB: string;
  dateTime: string;
  venue?: string;
  day: string;
  timeIT: string;
  game: string;
  result?: string;
  status?: string;
  series?: string;
  isLead?: boolean;
  isElimination?: boolean;
  winner?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let teamParam = searchParams.get('team')?.toLowerCase();

  if (!teamParam) {
    return NextResponse.json({ error: 'Parametro team mancante' }, { status: 400 });
  }

  teamParam = aliasMap[teamParam] || teamParam;

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'cwc_matches.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const allGames: Game[] = JSON.parse(fileContent);

    const now = Date.now();
    const futureGames = allGames
      .filter((game: Game) =>
        (game.teamA.toLowerCase() === teamParam || game.teamB.toLowerCase() === teamParam) &&
        new Date(game.dateTime).getTime() > now
      )
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    if (futureGames.length === 0) {
      return NextResponse.json({ error: 'Nessuna partita futura trovata per questa squadra.' }, { status: 404 });
    }

    const game = futureGames[0];

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
    });
  } catch (err) {
    console.error("Errore durante il recupero file CWC:", err);
    return NextResponse.json({ error: 'Errore durante il recupero file CWC' }, { status: 500 });
  }
}