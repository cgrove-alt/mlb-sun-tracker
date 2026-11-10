/** @jest-environment node */
import fs from 'node:fs';
import path from 'node:path';
import { getAllPosts, getCategories, getPostBySlug, getPostSlugs } from '@/lib/blog';
import { MLB_STADIUMS } from '@/src/data/stadiums';

// Broken blog links were the largest group of 404s on the site: 93 tag
// pages and 4 category pages that never existed, plus three hero images
// pointing at files that were never added.
describe('blog links', () => {
  const posts = getAllPosts();

  it('every frontmatter image exists in public/', () => {
    const missing = posts
      .filter((post) => post.image && !post.image.startsWith('http'))
      .filter((post) => !fs.existsSync(path.join(process.cwd(), 'public', post.image!)))
      .map((post) => `${post.slug}: ${post.image}`);
    expect(missing).toEqual([]);
  });

  it('every category has posts (each one has a page)', () => {
    for (const category of getCategories()) {
      expect(posts.some((post) => post.category === category)).toBe(true);
    }
  });

  it('no page links to a tag page, which does not exist', () => {
    const files = ['app/blog/page.tsx', 'app/blog/[slug]/page.tsx', 'app/blog/category/[category]/page.tsx'];
    for (const file of files) {
      expect(fs.readFileSync(path.join(process.cwd(), file), 'utf8')).not.toMatch(/\/blog\/tag\//);
    }
  });
});

// Posts whose shade claims haven't been checked against the engine are
// unpublished: listed nowhere, and their URLs 301 to the stadium page.
describe('unpublished posts', () => {
  const all = getPostSlugs().map((file) => getPostBySlug(file)!);
  const drafts = all.filter((post) => post.draft);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require('../../next.config.js');

  it('are left out of the published list', () => {
    const published = new Set(getAllPosts().map((post) => post.slug));
    expect(drafts.length).toBeGreaterThan(0);
    for (const post of drafts) expect(published.has(post.slug)).toBe(false);
  });

  it('each 301 to the page named in redirectTo', async () => {
    const redirects: { source: string; destination: string; statusCode?: number }[] = await config.redirects();
    for (const post of drafts) {
      expect(redirects).toContainEqual({ source: `/blog/${post.slug}`, destination: post.redirectTo, statusCode: 301 });
    }
  });

  it('redirect to pages that exist', () => {
    for (const post of drafts) {
      const target = post.redirectTo!;
      const page = target === '/' ? 'app/page.tsx' : `app${target.replace(/^\/stadium\/[^/]+$/, '/stadium/[stadiumId]')}/page.tsx`;
      expect([target, fs.existsSync(path.join(process.cwd(), page))]).toEqual([target, true]);
      const stadiumId = target.match(/^\/stadium\/([^/]+)$/)?.[1];
      if (stadiumId) expect(MLB_STADIUMS.map((s) => s.id)).toContain(stadiumId);
    }
  });

  it('are not in the sitemap', () => {
    const sitemap = fs.readFileSync(path.join(process.cwd(), 'public/sitemap-blog.xml'), 'utf8');
    for (const post of drafts) expect(sitemap).not.toContain(`/blog/${post.slug}<`);
  });
});
