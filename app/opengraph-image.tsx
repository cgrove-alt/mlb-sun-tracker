import { ImageResponse } from 'next/og';
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '../src/lib/ogCard';
import { VENUE_COUNT } from '../src/data/venueCount';

// Site-wide default OG image (homepage + any route without its own
// opengraph-image). Replaces the generic logo512.png.
export const alt = 'The Shadium — find the shaded seats at MLB, MiLB & NFL venues';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: 'THE SHADIUM',
      title: 'Plan for stadium sun',
      subtitle: `${VENUE_COUNT} MLB, MiLB & NFL venues · solar context with confidence disclosed`,
    }),
    { ...OG_SIZE },
  );
}
