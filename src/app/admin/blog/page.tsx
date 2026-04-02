'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '../blog-actions';
import Button from '@/app/components/ui/Button';
import CoverImageUpload from '@/app/components/CoverImageUpload';
import { FaPlus, FaTrash, FaEdit, FaBook, FaEye, FaEyeSlash } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  cover_image?: string;
  published_at: string;
  created_at: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author_name: 'Bitcoin Bénin',
    cover_image_path: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      fetchPosts();
    };

    init();
  }, [router]);

  const fetchPosts = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author_name: 'Bitcoin Bénin',
      cover_image_path: '',
      tags: '',
      status: 'draft',
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: '', // Don't load full content for now
      author_name: post.author_name,
      cover_image_path: post.cover_image || '',
      tags: post.tags.join(', '),
      status: post.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Convert storage path to public URL
      const coverImageUrl = formData.cover_image_path
        ? `https://hgnwadiljauqbhsbtxkk.supabase.co/storage/v1/object/public/${formData.cover_image_path}`
        : undefined;

      if (editingPost) {
        await updateBlogPost(editingPost.id, {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          author_name: formData.author_name,
          cover_image: coverImageUrl,
          tags: tagsArray,
          status: formData.status,
        });
      } else {
        await createBlogPost({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content || 'Contenu à venir...',
          author_name: formData.author_name,
          author_image: '/logo.svg',
          cover_image: coverImageUrl,
          tags: tagsArray,
          status: formData.status,
        });
      }

      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Vérifiez la console.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      await deleteBlogPost(id);
      fetchPosts();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatDateFR = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Configuration requise</h2>
          <p className="text-gray-400">Veuillez configurer Supabase pour accéder à l&apos;administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la page */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
            Gestion du
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-3">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Créez et gérez les articles du blog Bitcoin Bénin.
          </p>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="mb-12 bg-brand-charcoal/50 border border-white/5 rounded-xl p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              {editingPost ? 'Modifier l&apos;article' : 'Nouvel article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                    placeholder="Titre de l'article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                    placeholder="mon-article-super-interessante"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Extrait *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green resize-none"
                  rows={3}
                  placeholder="Court résumé de l'article..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                    placeholder="Nom de l'auteur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image de couverture
                  </label>
                  <CoverImageUpload
                    existingImage={formData.cover_image_path ? `https://hgnwadiljauqbhsbtxkk.supabase.co/storage/v1/object/public/${formData.cover_image_path}` : undefined}
                    onUploadComplete={(path) => setFormData({ ...formData, cover_image_path: path })}
                    onRemove={() => setFormData({ ...formData, cover_image_path: '' })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green"
                  placeholder="bitcoin, éducation, débutant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Statut
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'draft'}
                      onChange={() => setFormData({ ...formData, status: 'draft' })}
                      className="text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-gray-300">Brouillon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'published'}
                      onChange={() => setFormData({ ...formData, status: 'published' })}
                      className="text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-gray-300">Publié</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'archived'}
                      onChange={() => setFormData({ ...formData, status: 'archived' })}
                      className="text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-gray-300">Archivé</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  {editingPost ? 'Mettre à jour' : 'Publier'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des articles */}
        <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <FaBook />
              Articles ({posts.length})
            </h2>
            {!showForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <FaPlus />
                Nouvel article
              </Button>
            )}
          </div>

          <div className="divide-y divide-white/5">
            {posts.length === 0 ? (
              <div className="p-12 text-center">
                <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Aucun article
                </h3>
                <p className="text-gray-400">
                  Créez votre premier article pour commencer.
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-display font-bold text-white">
                          {post.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            post.status === 'published'
                              ? 'bg-brand-green/20 text-brand-green'
                              : post.status === 'draft'
                              ? 'bg-gray-600/20 text-gray-400'
                              : 'bg-orange-600/20 text-orange-400'
                          }`}
                        >
                          {post.status === 'published'
                            ? 'Publié'
                            : post.status === 'draft'
                            ? 'Brouillon'
                            : 'Archivé'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDateFR(post.published_at || post.created_at)}</span>
                        <span>•</span>
                        <span className="flex gap-1">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-brand-green/70">#{tag}</span>
                          ))}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <FaTrash size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
