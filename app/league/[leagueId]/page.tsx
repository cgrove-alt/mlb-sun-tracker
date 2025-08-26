import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ALL_LEAGUES, 
  getVenuesByLeague, 
  getLeagueInfo, 
  getAllLeagues 
} from '../../../src/data/unifiedVenues';
import LeagueClient from './LeagueClient';

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
  // Handle MiLB case sensitivity
  const leagueKey = leagueId.toLowerCase() === 'milb' ? 'MiLB' : leagueId.toUpperCase();
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
  // Handle MiLB case sensitivity
  const leagueKey = leagueId.toLowerCase() === 'milb' ? 'MiLB' : leagueId.toUpperCase();
  const league = getLeagueInfo(leagueKey);
  const venues = getVenuesByLeague(leagueKey);
  
  if (!league) {
    notFound();
  }

  return (
    <div className="league-page">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{league.name}</span>
        </nav>

        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              {league.name} Stadium Shade Guide
            </h1>
            <p className="text-base text-ink-700 mt-2 max-w-prose">
              Find the best shaded seats at all {venues.length} {league.name} venues
            </p>
          </div>
        </div>
          <div className="rounded-xl border bg-blue-50 p-4 md:p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm">
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

        <LeagueClient 
          leagueName={league.name}
          venues={venues.map(v => ({
            id: v.id,
            name: v.name,
            team: v.team,
            city: v.city,
            state: v.state,
            capacity: v.capacity,
            roof: v.roof || 'open'
          }))}
        />

        <section className="mb-8 mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            {league.sport} Shade Tips
          </h2>
          <div className="rounded-xl border bg-gray-50 p-4 md:p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 stack">
              <div>
                <h3 className="text-lg font-semibold mb-2">Best Game Times for Shade</h3>
                <ul className="space-y-1">
                  {league.typicalGameTimes.map((time: string) => (
                    <li key={time} className="text-ink-700">
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
                <ul className="space-y-1 text-ink-700">
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