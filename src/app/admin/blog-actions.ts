'use server';

import { supabaseAdmin } from '@/lib/supabase';

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_image?: string;
  cover_image?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      ...data,
      published_at: data.status === 'published' ? new Date().toISOString() : null,
    });

  if (error) {
    throw new Error(`Erreur lors de la création de l'article: ${error.message}`);
  }

  return true;
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    author_name?: string;
    author_image?: string;
    cover_image?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
  }
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  // If publishing, set published_at if not already set
  if (data.status === 'published') {
    const { data: existing } = await supabaseAdmin
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single();

    if (existing && !existing.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update(updateData)
    .eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de l'article: ${error.message}`);
  }

  return true;
}

export async function deleteBlogPost(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'article: ${error.message}`);
  }

  return true;
}

export async function getBlogPostById(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Erreur lors de la récupération de l'article: ${error.message}`);
  }

  return data;
}
