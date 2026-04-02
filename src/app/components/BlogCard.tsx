'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostPreview } from '@/app/types/blog';

interface BlogCardProps {
  post: BlogPostPreview;
}

function formatDateFR(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    locale: 'fr-FR'
  };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = formatDateFR(post.published_at);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-brand-charcoal/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-brand-green/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-green/10">
        {post.cover_image ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative h-48 w-full bg-gradient-to-br from-brand-green/20 to-brand-charcoal flex items-center justify-center">
            <div className="text-6xl font-bold text-brand-green/30">BB</div>
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3">
            {post.author_image ? (
              <Image
                src={post.author_image}
                alt={post.author_name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-sm font-bold">
                {post.author_name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-300 truncate">
                {post.author_name}
              </p>
              <p className="text-xs text-gray-500">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
