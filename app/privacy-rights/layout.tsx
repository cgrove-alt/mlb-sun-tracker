import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Privacy Rights | Data Export, Deletion & Opt-Out | The Shadium',
  description: 'Manage your data on The Shadium. Export your data, request deletion, view your data inventory, and control analytics tracking — all in one place.',
  alternates: {
    canonical: 'https://theshadium.com/privacy-rights',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Your Privacy Rights | The Shadium',
    description: 'Tools to export, delete, and manage your personal data on The Shadium.',
    url: 'https://theshadium.com/privacy-rights',
    type: 'website',
  },
};

export default function PrivacyRightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
