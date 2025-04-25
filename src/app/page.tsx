import LiveCountdownCard from "@/components/LiveCountdownCard"

export default function HomePage() {
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
        <LiveCountdownCard team="lakers" />
        <LiveCountdownCard team="celtics" />
        <LiveCountdownCard team="clippers" />
        <LiveCountdownCard team="knicks" />
        <LiveCountdownCard team="nuggets" />
        <LiveCountdownCard team="sixers" />
        <LiveCountdownCard team="heat" />
        <LiveCountdownCard team="bucks" />
        <LiveCountdownCard team="warriors" /> {/* <== Aggiunta questa riga */}
      </div>
    </main>
  )
}
