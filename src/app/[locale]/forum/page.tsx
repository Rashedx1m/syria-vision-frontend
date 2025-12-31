'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { forumAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare, Plus, User, Calendar,
  ThumbsUp, MessageCircle, Loader2, X
} from 'lucide-react';

// ===== تعديل الـ Interface ليطابق API =====
interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  color: string;
  posts_count: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    full_name: string;
    avatar: string | null;
  };
  category: Category;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export default function ForumPage() {
  const t = useTranslations('forum');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
  const [creating, setCreating] = useState(false);

  // ===== دالة مساعدة للحصول على الاسم حسب اللغة =====
  const getCategoryName = (category: Category) => {
    return locale === 'ar' ? category.name_ar : category.name_en;
  };

  const getCategoryDescription = (category: Category) => {
    return locale === 'ar' ? category.description_ar : category.description_en;
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [categoriesRes, postsRes] = await Promise.all([
        forumAPI.getCategories(),
        selectedCategory
          ? forumAPI.getCategoryPosts(selectedCategory)
          : forumAPI.getPosts(),
      ]);
      setCategories(categoriesRes.data.results || categoriesRes.data);
      setPosts(postsRes.data.results || postsRes.data);
    } catch (error) {
      console.error('Error fetching forum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.category) return;

    setCreating(true);
    try {
      await forumAPI.createPost({
        title: newPost.title,
        content: newPost.content,
        category: parseInt(newPost.category),
      });
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await forumAPI.likePost(postId);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            is_liked: !post.is_liked,
            likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">{t('title')}</h1>
          <p className="section-subtitle">{t('subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">{t('categories')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {t('allCategories')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{getCategoryName(category)}</span>
                    </span>
                    <span className="text-xs text-gray-500">{category.posts_count} {t('posts')}</span>
                  </button>
                ))}
              </div>

              {user && (
                <button
                  onClick={() => setShowNewPost(true)}
                  className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('newPost')}
                </button>
              )}
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link key={post.id} href={`/${locale}/forum/${post.id}`}>
                    <div className="card hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {post.author.avatar ? (
                            <img
                              src={post.author.avatar}
                              alt={post.author.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{post.author.full_name || post.author.username}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.created_at).toLocaleDateString(locale)}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                              {post.category.icon} {getCategoryName(post.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(post.id);
                          }}
                          className={`flex items-center gap-1 text-sm ${
                            post.is_liked ? 'text-primary-600' : 'text-gray-500'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes_count}
                        </button>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments_count} {t('comments')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">{t('noPosts')}</h3>
                <p className="text-gray-500">{t('beFirst')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('writePost')}</h2>
              <button onClick={() => setShowNewPost(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="label">{t('categories')}</label>
                <select
                  className="input"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  required
                >
                  <option value="">{t('selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {getCategoryName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t('postTitle')}</label>
                <input
                  type="text"
                  className="input"
                  placeholder={t('titlePlaceholder')}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">{t('postContent')}</label>
                <textarea
                  className="input min-h-[150px]"
                  placeholder={t('contentPlaceholder')}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="btn-secondary flex-1"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('creating')}
                    </>
                  ) : (
                    t('createPost')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}