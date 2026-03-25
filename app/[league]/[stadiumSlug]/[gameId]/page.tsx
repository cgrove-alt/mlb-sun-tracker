import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ league: string; stadiumSlug: string; gameId: string }>;
}

export default async function GamePage({ params }: Props) {
  const { league, stadiumSlug, gameId } = await params;
  // Redirect to stadium page with gamePk as param
  redirect(`/${league}/${stadiumSlug}?gamePk=${gameId}`);
}
