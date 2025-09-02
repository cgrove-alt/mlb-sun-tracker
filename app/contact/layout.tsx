import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - The Shadium',
  description: 'Get in touch with The Shadium team. Send us your questions, feedback, or partnership inquiries.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}