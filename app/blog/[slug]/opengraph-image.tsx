import { ImageResponse } from 'next/og';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '../../../src/lib/ogCard';
import { getPostBySlug, getAllPosts } from '@/lib/blog';

export const alt = 'The Shadium Blog';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? 'The Shadium Blog';

  return new ImageResponse(
    ogCard({
      eyebrow: 'THE SHADIUM BLOG',
      title,
      subtitle: undefined,
      titleFontSize: title.length > 48 ? 48 : 60,
    }),
    { ...OG_SIZE },
  );
}
