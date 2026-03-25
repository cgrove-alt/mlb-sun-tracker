import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MLB_STADIUMS } from '@/src/data/stadiums';
import { MLB_STADIUM_TO_TEAM } from '@/src/data/mlbTeams';
import { StadiumShadeView } from '@/src/components/StadiumShadeView';

interface Props {
  params: Promise<{ league: string; stadiumSlug: string }>;
  searchParams: Promise<{ date?: string; time?: string; offset?: string; roofState?: string }>;
}

export async function generateStaticParams() {
  return MLB_STADIUMS.map(s => ({ league: 'mlb', stadiumSlug: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stadiumSlug } = await params;
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumSlug);
  if (!stadium) return {};
  return {
    title: `${stadium.name} – Shaded Seats & Sun Analysis | The Shadium`,
    description: `Find the shadiest seats at ${stadium.name}. Real-time sun exposure by section for every game.`,
    openGraph: {
      title: `${stadium.name} Shade Guide`,
      description: `Find shaded seats at ${stadium.name} – sun exposure data for every section.`,
    },
  };
}

export default async function StadiumSlugPage({ params, searchParams }: Props) {
  const { league, stadiumSlug } = await params;
  const sp = await searchParams;

  const stadium = MLB_STADIUMS.find(s => s.id === stadiumSlug);
  if (!stadium) notFound();

  const teamId = MLB_STADIUM_TO_TEAM[stadiumSlug];
  const date = sp.date || '';
  const time = sp.time || '13:05';
  const offset = parseInt(sp.offset || '0', 10);
  const roofState = (sp.roofState || (stadium.roof === 'fixed' ? 'closed' : 'open')) as 'open' | 'closed';

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link href={`/${league}`} className="text-sm text-blue-600 hover:underline">← {league.toUpperCase()} Stadiums</Link>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stadium.name}</h1>
            <p className="text-gray-500 text-sm">{stadium.team} • {stadium.city}, {stadium.state}</p>
          </div>
          <ShareButton />
        </div>
      </div>

      <StadiumShadeView
        stadiumId={stadiumSlug}
        stadiumName={stadium.name}
        teamId={teamId}
        league={league}
        roof={stadium.roof}
        timezone={stadium.timezone}
        initialDate={date}
        initialTime={time}
        initialOffset={offset}
        initialRoofState={roofState}
      />
    </main>
  );
}

function ShareButton() {
  return (
    <div id="share-button-placeholder" />
  );
}
