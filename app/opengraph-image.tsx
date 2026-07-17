import { ImageResponse } from 'next/og';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '../src/lib/ogCard';

// Site-wide default OG image (homepage + any route without its own
// opengraph-image). Replaces the generic logo512.png.
export const alt = 'The Shadium — find the shaded seats at MLB, MiLB & NFL venues';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: 'THE SHADIUM',
      title: 'Find the shaded seats',
      subtitle: '180+ MLB, MiLB & NFL venues · real-time sun tracking',
    }),
    { ...OG_SIZE },
  );
}
