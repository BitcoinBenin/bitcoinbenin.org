import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import BlogList from '../../components/BlogList';
import type { Metadata } from 'next';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_image?: string;
  cover_image?: string;
  published_at: string;
  tags: string[];
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
      images: post.cover_image ? [post.cover_image] : undefined,
      locale: 'fr_FR',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.tags, 3);

  const formatDateFR = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* Back button */}
      <div className="container mx-auto px-4 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retour au blog</span>
        </Link>
      </div>

      {/* Article content */}
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          {post.cover_image && (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-2xl overflow-hidden">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              {post.author_image ? (
                <Image
                  src={post.author_image}
                  alt={post.author_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold">
                  {post.author_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-white font-medium">{post.author_name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} />
                  <span>{formatDateFR(post.published_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <div 
            className="text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <Tag size={20} />
            <span className="font-medium">Tags :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                href={`/blog?tag=${tag}`}
                className="px-4 py-2 rounded-full bg-brand-charcoal/50 text-gray-300 hover:text-brand-green hover:border-brand-green/50 border border-white/5 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Articles liés
          </h2>
          <BlogList posts={relatedPosts} />
        </section>
      )}
    </main>
  );
}

function formatContent(content: string): string {
  // Simple markdown-like formatting
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl md:text-4xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl md:text-3xl font-bold text-white mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl md:text-2xl font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    .replace(/\n/gim, '<br />');
}
