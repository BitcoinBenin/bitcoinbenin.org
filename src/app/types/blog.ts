export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_image?: string;
  cover_image?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  views: number;
}

export interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  author_image?: string;
  cover_image?: string;
  published_at: string;
  tags: string[];
}
