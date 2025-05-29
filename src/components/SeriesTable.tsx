interface Game {
    teamA: string;
    teamB: string;
    series?: string;
    winner?: string;
  }
  
  export default function SeriesTable({ seriesGames }: { seriesGames: Game[] }) {
    const uniqueSeries: Record<string, { team: string; wins: number }[]> = {};
  
    seriesGames.forEach((game) => {
      const key = `${game.teamA} vs ${game.teamB}`;
      if (!uniqueSeries[key]) {
        uniqueSeries[key] = [
          { team: game.teamA, wins: 0 },
          { team: game.teamB, wins: 0 }
        ];
      }
      if (game.winner === game.teamA) {
        uniqueSeries[key][0].wins += 1;
      } else if (game.winner === game.teamB) {
        uniqueSeries[key][1].wins += 1;
      }
    });
  
    return (
      <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th className="px-4 py-2">Serie</th>
              <th className="px-4 py-2">Stato</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(uniqueSeries).map(([matchup, teams]) => {
              const leader = teams[0].wins > teams[1].wins ? teams[0] : teams[1];
              return (
                <tr key={matchup} className="border-b">
                  <td className="px-4 py-2 font-semibold text-gray-700">{matchup}</td>
                  <td className="px-4 py-2 text-indigo-700 font-bold">
                    {leader.team.split(" ")[0].toUpperCase()} {leader.wins} - {teams.find(t => t !== leader)?.wins}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  