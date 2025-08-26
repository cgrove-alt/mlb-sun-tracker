import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getCategories } from '@/lib/blog';
import './blog.css';

export const metadata: Metadata = {
  title: 'Baseball Shade Blog | Stadium Tips & Guides | The Shadium',
  description: 'Expert tips on finding shaded seats at MLB stadiums. Learn about sun patterns, best sections for shade, and how to stay cool at baseball games.',
  keywords: [
    'MLB shade blog',
    'baseball stadium tips',
    'shaded seats guide',
    'stadium sun protection',
    'baseball game comfort',
    'MLB stadium guides'
  ],
  openGraph: {
    title: 'Baseball Shade Blog | The Shadium',
    description: 'Expert tips on finding shaded seats at MLB stadiums',
    type: 'website',
    url: 'https://theshadium.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  
  return (
    <main className="blog-page">
      <div className="blog-container">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate">Blog</span>
        </nav>

        <div className="blog-header">
          <h1>The Shadium Blog</h1>
          <p className="lead">
            Your ultimate resource for finding shade at MLB stadiums. Get expert tips, 
            stadium guides, and seasonal advice for staying cool at the ballpark.
          </p>
        </div>

        <div className="blog-layout">
          <div className="blog-main">
            <section className="blog-posts">
              {posts.length === 0 ? (
                <div className="no-posts">
                  <p>No blog posts yet. Check back soon for expert stadium shade guides!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <article key={post.slug} className="blog-card">
                    {post.image && (
                      <Link href={`/blog/${post.slug}`} className="blog-card-image">
                        <img src={post.image} alt={post.title} loading="lazy" />
                      </Link>
                    )}
                    <div className="blog-card-content">
                      <div className="blog-meta">
                        <span className="blog-category">{post.category}</span>
                        <span className="blog-date">{post.date}</span>
                        <span className="blog-reading-time">{post.readingTime}</span>
                      </div>
                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <div className="blog-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="blog-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link href={`/blog/${post.slug}`} className="read-more">
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>

          <aside className="blog-sidebar">
            <div className="sidebar-widget">
              <h3>Categories</h3>
              <ul className="category-list">
                <li>
                  <Link href="/blog">All Posts</Link>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <Link href={`/blog/category/${category}`}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget">
              <h3>Popular Topics</h3>
              <ul className="topic-list">
                <li><Link href="/blog/category/stadium-guides">Stadium Guides</Link></li>
                <li><Link href="/blog/category/seasonal">Seasonal Tips</Link></li>
                <li><Link href="/blog/category/how-to">How-To Guides</Link></li>
                <li><Link href="/blog/category/comparisons">Stadium Comparisons</Link></li>
              </ul>
            </div>

            <div className="sidebar-widget cta-widget">
              <h3>Find Your Shaded Seat</h3>
              <p>Use our real-time sun tracker to find the perfect shaded seat at any MLB stadium.</p>
              <Link href="/" className="cta-button">
                Check Shade Now →
              </Link>
            </div>

            <div className="sidebar-widget">
              <h3>Newsletter</h3>
              <p>Get weekly tips on finding the best shaded seats at MLB stadiums.</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  aria-label="Email for newsletter"
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}