import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import { marked } from 'marked';
import '../blog-post.css';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | The Shadium Blog',
    };
  }

  return {
    title: `${post.title} | The Shadium Blog`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : [],
      url: `https://theshadium.com/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  
  // Generate table of contents from content
  const headings = post.content.match(/^#{2,3}\s.+$/gm) || [];
  const toc = headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 2;
    const text = heading.replace(/^#+\s/, '');
    const id = text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return { level, text, id };
  });

  // Convert markdown to HTML using marked
  const htmlContent = await marked.parse(post.content);

  return (
    <main className="blog-post-page">
      <article className="blog-post">
        <div className="post-container">
          <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="truncate">{post.title}</span>
          </nav>

          <header className="post-header">
            <div className="post-meta">
              <Link href={`/blog/category/${post.category}`} className="post-category">
                {post.category.replace(/-/g, ' ')}
              </Link>
              <span className="post-date">{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="post-reading-time">{post.readingTime}</span>
            </div>
            
            <h1>{post.title}</h1>
            
            <p className="post-description">{post.description}</p>
            
            <div className="post-author">
              By <strong>{post.author}</strong>
            </div>
          </header>

          {post.image && (
            <div className="post-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}

          <div className="post-layout">
            <aside className="post-sidebar">
              <div className="toc-widget">
                <h3>Table of Contents</h3>
                <nav className="toc">
                  {toc.map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.id}`}
                      className={`toc-item toc-level-${item.level}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="share-widget">
                <h3>Share This Post</h3>
                <div className="share-buttons">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://theshadium.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-button twitter"
                    aria-label="Share on Twitter"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span>Twitter</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://theshadium.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-button facebook"
                    aria-label="Share on Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </aside>

            <div className="post-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          <div className="post-tags">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${tag}`} className="post-tag">
                #{tag}
              </Link>
            ))}
          </div>

          <section className="related-posts">
            <h2>Related Posts</h2>
            <div className="related-posts-grid">
              {relatedPosts.length > 0 ? (
                relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.slug} className="related-post-card">
                    {relatedPost.image && (
                      <Link href={`/blog/${relatedPost.slug}`} className="related-post-image">
                        <img src={relatedPost.image} alt={relatedPost.title} />
                      </Link>
                    )}
                    <div className="related-post-content">
                      <h3>
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p>{relatedPost.excerpt || relatedPost.description}</p>
                      <Link href={`/blog/${relatedPost.slug}`} className="read-more">
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <p className="no-related-posts">No related posts yet. Check back soon!</p>
              )}
            </div>
          </section>

          <div className="post-cta">
            <h2>Find Your Perfect Shaded Seat</h2>
            <p>Ready to put these tips into action? Use The Shadium's real-time sun tracker to find the best shaded seats at any MLB stadium.</p>
            <Link href="/" className="cta-button primary">
              Check Shade Coverage Now →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}