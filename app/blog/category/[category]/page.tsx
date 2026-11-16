import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getCategories, categoryLabel } from '@/lib/blog';
import '../../blog.css';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Only real categories get a page; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabel(category);
  const url = `https://theshadium.com/blog/category/${category}`;
  return {
    title: `${label} | The Shadium Blog`,
    description: `${label} from The Shadium: where to find shade at MLB ballparks.`,
    alternates: { canonical: url },
    openGraph: { title: `${label} | The Shadium Blog`, type: 'website', url },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getAllPosts().filter((post) => post.category === category);
  if (posts.length === 0) notFound();
  const label = categoryLabel(category);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theshadium.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://theshadium.com/blog' },
      { '@type': 'ListItem', position: 3, name: label, item: `https://theshadium.com/blog/category/${category}` },
    ],
  };

  return (
    <div className="blog-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="blog-container">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <span aria-hidden="true">/</span>
          <span>{label}</span>
        </nav>

        <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] mb-6">{label}</h1>

        <section className="blog-posts">
          {posts.map((post) => (
            <article key={post.slug} className="blog-card rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="blog-card-content p-4 md:p-5 stack">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-reading-time">{post.readingTime}</span>
                </div>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-excerpt">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
