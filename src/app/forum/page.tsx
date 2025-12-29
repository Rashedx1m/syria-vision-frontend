'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { forumAPI } from '@/lib/api';
import { Category, Post } from '@/types';
import { MessageSquare, Users, Clock, Plus, Loader2, Search, Pin, Lock, ThumbsUp, Eye } from 'lucide-react';

export default function ForumPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postsRes] = await Promise.all([
          forumAPI.getCategories(),
          forumAPI.getPosts(),
        ]);
        setCategories(catRes.data);
        setRecentPosts(postsRes.data.results || postsRes.data);
      } catch (error) {
        console.error('Error fetching forum data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await forumAPI.searchPosts(searchQuery);
      setRecentPosts(response.data.results || response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Community Forum</h1>
            <p className="text-gray-600 mt-2">
              Connect, discuss, and share ideas with the community
            </p>
          </div>
          <Link href="/forum/new" className="btn-primary flex items-center gap-2 w-fit">
            <Plus className="w-5 h-5" />
            New Post
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="input pl-12 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/forum/category/${category.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <MessageSquare
                          className="w-5 h-5"
                          style={{ color: category.color }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">{category.name_en}</span>
                    </div>
                    <span className="text-sm text-gray-500">{category.posts_count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {searchQuery ? 'Search Results' : 'Recent Posts'}
              </h2>

              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/forum/post/${post.id}`}
                      className="block p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            {post.is_pinned && (
                              <Pin className="w-4 h-4 text-accent-500" />
                            )}
                            {post.is_locked && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                            <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {post.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {post.author?.username || 'Anonymous'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(post.created_at)}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs"
                              style={{
                                backgroundColor: `${post.category?.color || '#3B82F6'}20`,
                                color: post.category?.color || '#3B82F6',
                              }}
                            >
                              {post.category?.name_en || 'General'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {post.replies_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No posts found</p>
                  <Link href="/forum/new" className="text-primary-600 hover:underline">
                    Create the first post
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
