import type { Metadata } from 'next';
import HomePage from './HomePage';
import { finderParks } from '../src/components/ShadeFinder/finderParks';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://theshadium.com/',
  },
};

export default function Page() {
  return <HomePage parks={finderParks()} />;
}
