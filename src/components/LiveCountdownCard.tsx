'use client'

import { useEffect, useState } from "react"

export interface GameData {
  teamA: string
  teamB: string
  dateTime: string
  venue?: string
  day: string
  timeIT: string
  game: string
  result?: string
  scoreA?: number
  scoreB?: number
}

const teamSolidColors: Record<string, string> = {
  "Boston Celtics": "bg-green-700",
  "Miami Heat": "bg-red-700",
  "New York Knicks": "bg-blue-700",
  "Philadelphia 76ers": "bg-blue-800",
  "Cleveland Cavaliers": "bg-red-800",
  "Orlando Magic": "bg-blue-600",
  "Milwaukee Bucks": "bg-green-900",
  "Indiana Pacers": "bg-yellow-600",
  "Denver Nuggets": "bg-blue-800",
  "Los Angeles Lakers": "bg-purple-700",
  "Minnesota Timberwolves": "bg-teal-800",
  "Phoenix Suns": "bg-orange-600",
  "Oklahoma City Thunder": "bg-sky-600",
  "New Orleans Pelicans": "bg-indigo-800",
  "LA Clippers": "bg-red-700",
  "Dallas Mavericks": "bg-blue-900",
  "Golden State Warriors": "bg-yellow-600",
  "Houston Rockets": "bg-red-800",
  "Memphis Grizzlies": "bg-cyan-900",
  "Detroit Pistons": "bg-red-700"
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
  "Denver Nuggets": "https://loodibee.com/wp-content/uploads/denver-nuggets-logo-symbol.png",
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

const teamNameMapping: Record<string, string> = {
  "Warriors": "Golden State Warriors",
  "Lakers": "Los Angeles Lakers",
  "Celtics": "Boston Celtics",
  "Sixers": "Philadelphia 76ers",
  "76ers": "Philadelphia 76ers",
  "Knicks": "New York Knicks",
  "Nuggets": "Denver Nuggets",
  "Clippers": "LA Clippers",
  "Mavericks": "Dallas Mavericks",
  "Bucks": "Milwaukee Bucks",
  "Cavaliers": "Cleveland Cavaliers",
  "Magic": "Orlando Magic",
  "Heat": "Miami Heat",
  "Wolves": "Minnesota Timberwolves",
  "Timberwolves": "Minnesota Timberwolves",
  "Suns": "Phoenix Suns",
  "Pelicans": "New Orleans Pelicans",
  "Pacers": "Indiana Pacers",
  "Thunder": "Oklahoma City Thunder",
  "Grizzlies": "Memphis Grizzlies",
  "Pistons": "Detroit Pistons"
};

function mapTeamName(apiTeamName: string): string {
  return teamNameMapping[apiTeamName] || apiTeamName;
}


function removeDuplicateGames(games: GameData[]): GameData[] {
  const uniqueGames = new Map();
  games.forEach((game) => {
    const key = `${game.teamA}-${game.teamB}-${game.dateTime}`;
    if (!uniqueGames.has(key)) {
      uniqueGames.set(key, game);
    }
  });
  return Array.from(uniqueGames.values());
}

export { teamSolidColors, teamLogos, mapTeamName, removeDuplicateGames }

export default function LiveCountdownCard({ team }: { team: string }) {
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
  async function fetchGame() {
    try {
      const response = await fetch('/playoffs-2025-updated.json');
      if (!response.ok) throw new Error('Errore nel caricamento del file JSON');
      
      const data: GameData[] = await response.json();
      const filteredData = removeDuplicateGames(
        data.filter(game => game.teamA === team || game.teamB === team)
      );

      if (filteredData.length > 0) {
        setGameData(filteredData[0]);
      } else {
        console.error('Nessuna partita trovata per il team:', team);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    }
  }

  fetchGame();
}, [team]);



  useEffect(() => {
    if (!gameData) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const gameTime = new Date(gameData.dateTime).getTime();
      const distance = gameTime - now;

      if (distance < 0) {
        setCountdown('LIVE');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(`${days}g ${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [gameData]);

  if (!gameData) return null;

  const mappedTeamA = gameData.teamA;
  const mappedTeamB = gameData.teamB;
  const bgColorA = teamSolidColors[mappedTeamA] || 'bg-gray-600';
  const bgColorB = teamSolidColors[mappedTeamB] || 'bg-gray-600';
  const logoA = teamLogos[mappedTeamA];
  const logoB = teamLogos[mappedTeamB];
  const scoreInfo = gameData.scoreA != null && gameData.scoreB != null ? ` | ${gameData.scoreA} - ${gameData.scoreB}` : '';

  return (
    <div className="rounded-xl shadow-md text-white w-full flex flex-col sm:flex-row overflow-hidden mb-4">
      <div className={`flex-1 flex flex-col items-center justify-center p-4 ${bgColorA}`}>
        <img src={logoA} alt={mappedTeamA} className="w-14 h-14 mb-2 sm:w-20 sm:h-20" />
        <div className="text-base sm:text-xl font-semibold text-center leading-tight">{mappedTeamA}</div>
      </div>

      <div className="bg-black flex flex-col justify-center items-center px-2 py-4 w-full sm:w-56 text-center">
        <div className="text-xs uppercase tracking-widest text-gray-400">{gameData.game}</div>
        <div className="text-base sm:text-lg font-bold mt-1">
          {gameData.result ? `Serie: ${gameData.result}` : "Prossimo Match"}{scoreInfo}
        </div>
        <div className="text-sm mt-1">{gameData.day} - {gameData.timeIT}</div>
        <div className="text-xs text-gray-400 mt-1 leading-tight">{gameData.venue}</div>
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

      <div className={`flex-1 flex flex-col items-center justify-center p-4 ${bgColorB}`}>
        <img src={logoB} alt={mappedTeamB} className="w-14 h-14 mb-2 sm:w-20 sm:h-20" />
        <div className="text-base sm:text-xl font-semibold text-center leading-tight">{mappedTeamB}</div>
      </div>
    </div>
  )
}
