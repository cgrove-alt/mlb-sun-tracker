import Link from 'next/link';
import { MLB_STADIUMS } from '@/src/data/stadiums';

export const metadata = { title: 'MLB Stadiums — Shadium' };

export default function MLBStadiumsPage() {
  const stadiums = [...MLB_STADIUMS].sort((a, b) => a.team.localeCompare(b.team));

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">MLB Stadiums</h1>
      <p className="text-gray-600 mb-6">
        Pick a stadium to see shade by section for any game.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stadiums.map(stadium => (
          <Link
            key={stadium.id}
            href={`/mlb/${stadium.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="font-semibold text-gray-900">{stadium.team}</div>
            <div className="text-sm text-gray-600 mt-0.5">{stadium.name}</div>
            <div className="text-xs text-gray-400 mt-1 capitalize">{stadium.roof} roof</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
