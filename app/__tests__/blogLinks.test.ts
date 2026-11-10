/** @jest-environment node */
import fs from 'node:fs';
import path from 'node:path';
import { getAllPosts, getCategories } from '@/lib/blog';

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
