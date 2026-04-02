import { getPublishedPosts, getAllTags } from '@/lib/blog';
import BlogHero from '../components/BlogHero';
import BlogList from '../components/BlogList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog",
  description: "Lisez nos articles sur Bitcoin, la cryptomonnaie, et l'écosystème blockchain au Bénin. Guides, tutoriels et actualités de la communauté Bitcoin Bénin.",
  openGraph: {
    title: 'Blog Bitcoin Bénin',
    description: "Lisez nos articles sur Bitcoin, la cryptomonnaie, et l'écosystème blockchain au Bénin.",
    type: 'website',
    locale: 'fr_FR',
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const tags = await getAllTags();

  return (
    <main className="min-h-screen">
      <BlogHero postCount={posts.length} tagCount={tags.length} />

      <section id="articles" className="container mx-auto px-4 py-20">
        <BlogList posts={posts} />
      </section>
    </main>
  );
}
