import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ALL_LEAGUES, 
  getVenuesByLeague, 
  getLeagueInfo, 
  getAllLeagues 
} from '../../../src/data/unifiedVenues';

interface LeaguePageProps {
  params: Promise<{
    leagueId: string;
  }>;
}

export async function generateStaticParams() {
  return getAllLeagues().map((league) => ({
    leagueId: league.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: LeaguePageProps): Promise<Metadata> {
  const { leagueId } = await params;
  const leagueKey = leagueId.toUpperCase();
  const league = getLeagueInfo(leagueKey);
  
  if (!league) {
    return {
      title: 'League Not Found | The Shadium',
    };
  }

  const title = `${league.name} Stadium Shade Guide | The Shadium`;
  const description = `Find shaded seats at all ${league.name} stadiums. Complete sun exposure analysis, shade maps, and seating recommendations for every ${league.sport} venue.`;

  return {
    title,
    description,
    keywords: [
      `${league.name} stadium shade`,
      `${league.sport} stadium shade guide`,
      `${leagueKey} shaded seats`,
      `${league.sport} sun exposure`,
      `best shaded seats ${league.sport}`,
      `${league.name} venue shade map`,
      `${league.sport} stadium sun tracker`,
      `avoid sun ${league.sport} games`
    ],
    alternates: {
      canonical: `https://theshadium.com/league/${leagueId}`,
    },
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/league/${leagueId}`,
      type: 'website',
    },
  };
}

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { leagueId } = await params;
  const leagueKey = leagueId.toUpperCase();
  const league = getLeagueInfo(leagueKey);
  const venues = getVenuesByLeague(leagueKey);
  
  if (!league) {
    notFound();
  }

  return (
    <div className="league-page">
      <div className="container mx-auto px-4 py-8">
        <nav className="breadcrumb mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{league.name}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {league.name} Stadium Shade Guide
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Find the best shaded seats at all {venues.length} {league.name} venues
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Sport:</strong> {league.sport}
              </div>
              <div>
                <strong>Season:</strong> {league.season.start} - {league.season.end}
              </div>
              <div>
                <strong>Venues:</strong> {venues.length} stadiums
              </div>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">All {league.name} Venues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venue/${venue.id}`}
                className="venue-card block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {venue.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    venue.roof === 'fixed' ? 'bg-green-100 text-green-800' :
                    venue.roof === 'retractable' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venue.roof === 'fixed' ? '🏢 Covered' :
                     venue.roof === 'retractable' ? '🏟️ Retractable' :
                     '☀️ Open Air'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{venue.team}</p>
                <p className="text-sm text-gray-500 mb-4">
                  📍 {venue.city}, {venue.state}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>🏟️ {venue.capacity.toLocaleString()} seats</span>
                  <span className="text-blue-600 font-medium">
                    View Shade Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {league.sport} Shade Tips
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Best Game Times for Shade</h3>
                <ul className="space-y-1">
                  {league.typicalGameTimes.map((time: string) => (
                    <li key={time} className="text-gray-600">
                      • {time} - {
                        parseInt(time.split(':')[0]) < 15 ? 'Day game (more sun exposure)' :
                        parseInt(time.split(':')[0]) < 18 ? 'Afternoon (moderate shade)' :
                        'Evening (better shade coverage)'
                      }
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Season Considerations</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Early season ({league.season.start}): Lower sun angle</li>
                  <li>• Mid-season: Peak sun exposure risk</li>
                  <li>• Late season ({league.season.end}): Better natural shade</li>
                  {league.sport === 'football' && (
                    <li>• Cold weather games: Sun can be beneficial</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Other Leagues</h2>
          <div className="flex flex-wrap gap-4">
            {getAllLeagues()
              .filter(l => l !== leagueKey)
              .map((otherLeague) => {
                const otherLeagueInfo = getLeagueInfo(otherLeague);
                return (
                  <Link
                    key={otherLeague}
                    href={`/league/${otherLeague.toLowerCase()}`}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {otherLeagueInfo?.name}
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}