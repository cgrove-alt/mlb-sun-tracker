import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import '../blog-post.css';

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
    const id = text.toLowerCase().replace(/\s+/g, '-');
    return { level, text, id };
  });

  // Convert markdown to HTML (simple version for static export)
  const htmlContent = convertMarkdownToHtml(post.content);

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

            <div className="post-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">
                #{tag}
              </span>
            ))}
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

// Simple markdown to HTML converter for static export
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return `<h1 id="${id}">${text}</h1>`;
  });
  
  // Convert bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert lists - handle multi-line
  const lines = html.split('\n');
  let inList = false;
  let listType = '';
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\* /)) {
      if (!inList || listType !== 'ul') {
        if (inList) processedLines.push(`</${listType}>`);
        processedLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(line.replace(/^\* (.+)$/, '<li>$1</li>'));
    } else if (line.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') {
        if (inList) processedLines.push(`</${listType}>`);
        processedLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(line.replace(/^\d+\. (.+)$/, '<li>$1</li>'));
    } else {
      if (inList) {
        processedLines.push(`</${listType}>`);
        inList = false;
      }
      processedLines.push(line);
    }
  }
  if (inList) {
    processedLines.push(`</${listType}>`);
  }
  
  html = processedLines.join('\n');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert paragraphs
  html = html.split('\n\n').map(para => {
    if (!para.startsWith('<')) {
      return `<p>${para}</p>`;
    }
    return para;
  }).join('\n');
  
  return html;
}