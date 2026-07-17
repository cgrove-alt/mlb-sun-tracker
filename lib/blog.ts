import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/blog');

// Parse a frontmatter date. Bare "YYYY-MM-DD" values are parsed as LOCAL noon so
// the displayed calendar date can't shift a day under a non-UTC build timezone
// (new Date("2026-07-17") is UTC midnight, which renders as the 16th in EDT/PDT).
function parseFrontmatterDate(value: unknown): Date | null {
  if (!value) return null;
  const s = String(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T12:00:00`) : new Date(s);
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateISO: string;
  dateModified?: string;
  dateModifiedISO?: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime: string;
  content: string;
  excerpt?: string;
}

export function getPostSlugs() {
  try {
    const files = fs.readdirSync(postsDirectory);
    return files.filter((file) => file.endsWith('.mdx'));
  } catch (error) {
    // Directory doesn't exist yet
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const stats = readingTime(content);
    
    const rawDate = parseFrontmatterDate(data.date);
    // Optional correction date — only present on posts we substantively updated.
    const rawModified = parseFrontmatterDate(data.dateModified);

    return {
      slug: realSlug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: rawDate ? format(rawDate, 'MMMM d, yyyy') : '',
      dateISO: rawDate ? rawDate.toISOString() : '',
      dateModified: rawModified ? format(rawModified, 'MMMM d, yyyy') : undefined,
      dateModifiedISO: rawModified ? rawModified.toISOString() : undefined,
      author: data.author || 'The Shadium Team',
      category: data.category || 'general',
      tags: data.tags || [],
      image: data.image,
      readingTime: stats.text,
      content,
      excerpt: data.excerpt || content.substring(0, 200) + '...'
    };
  } catch (error) {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => {
      const date1 = new Date(post1.date);
      const date2 = new Date(post2.date);
      return date2.getTime() - date1.getTime();
    });
  return posts;
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  const allPosts = getAllPosts().filter((post) => post.slug !== currentSlug);
  
  // Find posts with similar tags or category
  const scoredPosts = allPosts.map((post) => {
    let score = 0;
    
    // Same category gets 2 points
    if (post.category === currentPost.category) score += 2;
    
    // Each matching tag gets 1 point
    currentPost.tags.forEach((tag) => {
      if (post.tags.includes(tag)) score += 1;
    });
    
    return { post, score };
  });
  
  // Sort by score and return top posts
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

export function getTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}