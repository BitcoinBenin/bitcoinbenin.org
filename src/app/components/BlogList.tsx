'use client';

import BlogCard from './BlogCard';
import type { BlogPostPreview } from '@/app/types/blog';

interface BlogListProps {
  posts: BlogPostPreview[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-white mb-2">Aucun article pour le moment</h3>
        <p className="text-gray-400">Revenez bientôt pour découvrir nos nouveaux contenus sur Bitcoin !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
