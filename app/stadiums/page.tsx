import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'All Stadiums - The Shadium',
  description: 'Find shaded seats at MLB, NFL, and MiLB stadiums',
};

// Redirect to MLB stadiums page since that's the primary focus
export default function StadiumsPage() {
  redirect('/league/mlb');
}