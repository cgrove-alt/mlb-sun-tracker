/**
 * SafeSchema embeds JSON-LD via dangerouslySetInnerHTML.
 *
 * JSON.stringify escapes quotes and backslashes but NOT `</script>`. Inside a
 * <script> element the HTML parser terminates the block at that byte sequence
 * regardless of JSON context, so any schema value containing it — an FAQ
 * answer, a venue name, anything content-derived — would close the tag early
 * and the remainder would be parsed as live markup.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { SafeSchema } from '../SafeSchema';

function scriptHtml(schema: Record<string, any>): string {
  const { container } = render(<SafeSchema schema={schema} />);
  const el = container.querySelector('script[type="application/ld+json"]');
  return el?.innerHTML ?? '';
}

describe('SafeSchema', () => {
  it('renders a JSON-LD script tag', () => {
    const html = scriptHtml({ '@type': 'FAQPage' });
    expect(html).toContain('FAQPage');
  });

  it('escapes a closing script tag so it cannot break out', () => {
    const html = scriptHtml({ name: 'evil</script><img src=x onerror=alert(1)>' });
    expect(html).not.toContain('</script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('\\u003c');
  });

  it('escapes angle brackets and ampersands generally', () => {
    const html = scriptHtml({ name: '<b>a & b</b>' });
    expect(html).not.toMatch(/[<>&]/);
  });

  it('escapes JS line terminators that are legal in JSON', () => {
    const html = scriptHtml({ name: 'a\u2028b\u2029c' });
    expect(html).not.toContain('\u2028');
    expect(html).not.toContain('\u2029');
  });

  it('still produces valid JSON that parses back to the original object', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is 5 > 3 & 2 < 4?', acceptedAnswer: { '@type': 'Answer', text: 'Yes </script>' } },
      ],
    };
    const html = scriptHtml(schema);
    // The escapes are \uXXXX sequences, which JSON.parse resolves back.
    expect(JSON.parse(html)).toEqual(schema);
  });
});
