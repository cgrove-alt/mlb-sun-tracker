import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MLB_STADIUMS } from '@/src/data/stadiums';

interface Props {
  params: Promise<{ league: string }>;
}

// MLB division groupings
const MLB_DIVISIONS: Record<string, string[]> = {
  'AL East': ['yankees', 'redsox', 'orioles', 'rays', 'bluejays'],
  'AL Central': ['twins', 'guardians', 'whitesox', 'tigers', 'royals'],
  'AL West': ['astros', 'mariners', 'rangers', 'angels', 'athletics'],
  'NL East': ['braves', 'mets', 'phillies', 'nationals', 'marlins'],
  'NL Central': ['cubs', 'cardinals', 'brewers', 'pirates', 'reds'],
  'NL West': ['dodgers', 'giants', 'padres', 'rockies', 'diamondbacks'],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { league } = await params;
  const leagueUpper = league.toUpperCase();
  return {
    title: `${leagueUpper} Stadiums – Find Shaded Seats | The Shadium`,
    description: `Browse all ${leagueUpper} stadiums and find the shadiest seats for your next game.`,
    openGraph: {
      title: `${leagueUpper} Stadium Shade Guide`,
      description: `Find shaded seats at every ${leagueUpper} stadium.`,
    },
  };
}

export default async function LeaguePage({ params }: Props) {
  const { league } = await params;

  if (league.toLowerCase() !== 'mlb') {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Home</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">MLB Stadiums</h1>
        <p className="text-gray-600 mt-1">Select a stadium to find shaded seats</p>
      </div>

      <div className="space-y-8">
        {Object.entries(MLB_DIVISIONS).map(([division, teamIds]) => {
          const divisionStadiums = teamIds
            .map(id => MLB_STADIUMS.find(s => s.id === id))
            .filter(Boolean) as typeof MLB_STADIUMS;

          return (
            <div key={division}>
              <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3">
                {division}
              </h2>
              <div className="space-y-2">
                {divisionStadiums.map(stadium => (
                  <Link
                    key={stadium.id}
                    href={`/${league}/${stadium.id}`}
                    className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all group"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-700">{stadium.name}</div>
                      <div className="text-sm text-gray-500">{stadium.team} • {stadium.city}, {stadium.state}</div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="capitalize">{stadium.roof === 'retractable' ? '🔄 Retractable' : stadium.roof === 'fixed' ? '🏛 Covered' : '☀️ Open'}</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
