import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Do Not Sell or Share My Personal Information | The Shadium',
  description: 'Exercise your California Consumer Privacy Act (CCPA) rights. Submit a request to opt out of the sale or sharing of your personal information on The Shadium.',
  alternates: {
    canonical: 'https://theshadium.com/do-not-sell',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Do Not Sell or Share My Personal Information | The Shadium',
    description: 'CCPA opt-out request form for California residents.',
    url: 'https://theshadium.com/do-not-sell',
    type: 'website',
  },
};

export default function DoNotSellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
