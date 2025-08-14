import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import '../blog-post.css';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
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
      url: `https://theshadium.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
}

const components = {
  h2: ({ children }: any) => (
    <h2 id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
      {children}
    </h3>
  ),
  a: ({ href, children }: any) => {
    if (href?.startsWith('/')) {
      return <Link href={href}>{children}</Link>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug);
  
  // Generate table of contents from content
  const headings = post.content.match(/^#{2,3}\s.+$/gm) || [];
  const toc = headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 2;
    const text = heading.replace(/^#+\s/, '');
    const id = text.toLowerCase().replace(/\s+/g, '-');
    return { level, text, id };
  });

  return (
    <main className="blog-post-page">
      <article className="blog-post">
        <div className="post-container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span> › </span>
            <Link href="/blog">Blog</Link>
            <span> › </span>
            <span>{post.title}</span>
          </nav>

          <header className="post-header">
            <div className="post-meta">
              <Link href={`/blog/category/${post.category}`} className="post-category">
                {post.category}
              </Link>
              <span className="post-date">{post.date}</span>
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
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://theshadium.com/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-button facebook"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </aside>

            <div className="post-content">
              <MDXRemote 
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
                  },
                }}
                components={components}
              />
              
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className="related-posts">
            <h2>Related Posts</h2>
            <div className="related-posts-grid">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="related-post-card">
                  <h3>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p>{relatedPost.excerpt}</p>
                  <Link href={`/blog/${relatedPost.slug}`} className="read-more">
                    Read More →
                  </Link>
                </article>
              ))}
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
        .blog-post-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8f9fa, #ffffff);
          padding: 2rem 0 4rem;
        }

        .post-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .breadcrumb {
          margin-bottom: 2rem;
          color: #666;
          font-size: 0.9rem;
        }

        .breadcrumb a {
          color: #2196f3;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .post-header {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .post-meta {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: #666;
        }

        .post-category {
          color: #2196f3;
          text-decoration: none;
          font-weight: 500;
        }

        .post-category:hover {
          text-decoration: underline;
        }

        .post-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .post-description {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .post-author {
          color: #666;
        }

        .post-image {
          margin-bottom: 3rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .post-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .post-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .post-sidebar {
          position: sticky;
          top: 80px;
          height: fit-content;
        }

        .toc-widget,
        .share-widget {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .toc-widget h3,
        .share-widget h3 {
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: #1a1a1a;
        }

        .toc {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .toc-item {
          color: #666;
          text-decoration: none;
          padding: 0.25rem 0;
          border-left: 2px solid transparent;
          padding-left: 0.75rem;
          transition: all 0.2s;
        }

        .toc-item:hover {
          color: #2196f3;
          border-left-color: #2196f3;
        }

        .toc-level-3 {
          padding-left: 1.5rem;
          font-size: 0.9rem;
        }

        .share-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .share-button {
          flex: 1;
          padding: 0.5rem;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          color: white;
          font-size: 0.9rem;
        }

        .share-button.twitter {
          background: #1da1f2;
        }

        .share-button.facebook {
          background: #1877f2;
        }

        .post-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .post-content :global(h2) {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
          font-size: 1.75rem;
        }

        .post-content :global(h3) {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
          font-size: 1.35rem;
        }

        .post-content :global(p) {
          margin-bottom: 1.25rem;
          line-height: 1.7;
          color: #333;
        }

        .post-content :global(ul),
        .post-content :global(ol) {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .post-content :global(li) {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }

        .post-content :global(a) {
          color: #2196f3;
          text-decoration: none;
        }

        .post-content :global(a:hover) {
          text-decoration: underline;
        }

        .post-content :global(blockquote) {
          border-left: 4px solid #2196f3;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #666;
          font-style: italic;
        }

        .post-content :global(code) {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .post-content :global(pre) {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.25rem;
        }

        .post-content :global(pre code) {
          background: none;
          padding: 0;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e0e0e0;
        }

        .post-tag {
          padding: 0.5rem 1rem;
          background: #f0f0f0;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #666;
        }

        .related-posts {
          margin-bottom: 3rem;
        }

        .related-posts h2 {
          margin-bottom: 2rem;
          font-size: 1.75rem;
          text-align: center;
        }

        .related-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .related-post-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .related-post-card h3 {
          margin-bottom: 0.75rem;
        }

        .related-post-card h3 a {
          color: #1a1a1a;
          text-decoration: none;
        }

        .related-post-card h3 a:hover {
          color: #2196f3;
        }

        .related-post-card p {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .post-cta {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: white;
          padding: 3rem;
          border-radius: 12px;
          text-align: center;
        }

        .post-cta h2 {
          margin-bottom: 1rem;
        }

        .post-cta p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          display: inline-block;
          background: white;
          color: #2196f3;
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
        }

        .cta-button:hover {
          background: #f8f9fa;
        }

        @media (max-width: 768px) {
          .post-layout {
            grid-template-columns: 1fr;
          }

          .post-sidebar {
            position: static;
            order: 2;
          }

          .post-header h1 {
            font-size: 2rem;
          }

          .post-description {
            font-size: 1.1rem;
          }
        }
    </main>
  );
}