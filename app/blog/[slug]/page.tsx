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
    </main>
  );
}