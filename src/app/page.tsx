import LiveCountdownCard from "@/components/LiveCountdownCard";

export default function HomePage() {
  const teams = [
    "lakers",
    "celtics",
    "knicks",
    "nuggets",
    "warriors",
    "timberwolves",
    "cavaliers",
    "pacers",
    "thunder"
  ];

  // Rimuovere i duplicati dalle squadre
  const uniqueTeams = Array.from(new Set(teams));

  // Funzione per rimuovere duplicati tra i dati delle partite
  function removeDuplicateGames(games: GameData[]): GameData[] {
    const seen = new Set();
    return games.filter((game) => {
      const key = `${game.teamA}-${game.teamB}-${game.dateTime}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://loodibee.com/wp-content/uploads/nba-logo-transparent.png"
          alt="NBA Logo"
          className="w-20 mb-2 drop-shadow-md"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          NBA Playoff 2025
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Prossime partite delle squadre in evidenza
        </p>
      </div>

      <div className="w-full max-w-6xl grid gap-6 grid-cols-1 sm:grid-cols-2">
        {uniqueTeams.map((team) => (
          <LiveCountdownCard key={team} team={team} removeDuplicateGames={removeDuplicateGames} />
        ))}
      </div>
    </main>
  );
}
