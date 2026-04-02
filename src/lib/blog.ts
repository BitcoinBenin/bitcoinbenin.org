import { supabase } from './supabase';
import type { BlogPost, BlogPostPreview } from '../app/types/blog';

export async function getPublishedPosts(): Promise<BlogPostPreview[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, author_name, author_image, cover_image, published_at, tags')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return null;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data;
}

export async function getRelatedPosts(slug: string, tags: string[], limit: number = 3): Promise<BlogPostPreview[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  if (tags.length === 0) {
    return getPublishedPosts();
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, author_name, author_image, cover_image, published_at, tags')
    .eq('status', 'published')
    .neq('slug', slug)
    .overlaps('tags', tags)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data || [];
}

export async function getPostsByTag(tag: string): Promise<BlogPostPreview[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, author_name, author_image, cover_image, published_at, tags')
    .eq('status', 'published')
    .contains('tags', [tag])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }

  return data || [];
}

export async function getAllTags(): Promise<string[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  const allTags = new Set<string>();
  data?.forEach(post => {
    post.tags?.forEach(tag => allTags.add(tag));
  });

  return Array.from(allTags).sort();
}
