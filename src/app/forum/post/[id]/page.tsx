'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { forumAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Reply } from '@/types';
import {
  ArrowLeft, Loader2, ThumbsUp, MessageSquare, Clock,
  User, Send, CornerDownRight,
} from 'lucide-react';

export default function PostDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await forumAPI.getPost(Number(params.id));
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!user) return;
    try {
      await forumAPI.likePost(Number(params.id));
      fetchPost();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLikeReply = async (replyId: number) => {
    if (!user) return;
    try {
      await forumAPI.likeReply(replyId);
      fetchPost();
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    setSubmitting(true);
    try {
      await forumAPI.createReply({
        post: Number(params.id),
        content: replyContent,
        parent: replyingTo || undefined,
      });
      setReplyContent('');
      setReplyingTo(null);
      fetchPost();
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ReplyComponent = ({ reply, depth = 0 }: { reply: Reply; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {reply.author?.username || 'Anonymous'}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {formatDate(reply.created_at)}
            </span>
          </div>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => handleLikeReply(reply.id)}
            className={`flex items-center gap-1 text-sm ${
              reply.is_liked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {reply.likes_count}
          </button>
          {user && (
            <button
              onClick={() => setReplyingTo(reply.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"
            >
              <CornerDownRight className="w-4 h-4" />
              Reply
            </button>
          )}
        </div>
      </div>
      {reply.children?.map((child) => (
        <ReplyComponent key={child.id} reply={child} depth={depth + 1} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <Link href="/forum" className="text-primary-600 hover:underline">
            Back to forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to forum
        </Link>

        {/* Post */}
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${post.category?.color || '#3B82F6'}20`,
                color: post.category?.color || '#3B82F6',
              }}
            >
              {post.category?.name_en || 'General'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author?.username || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.is_liked
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-50'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              {post.likes_count} Likes
            </button>
            <span className="flex items-center gap-2 text-gray-500">
              <MessageSquare className="w-5 h-5" />
              {post.replies_count} Replies
            </span>
          </div>
        </div>

        {/* Reply Form */}
        {user ? (
          <div className="card mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              {replyingTo ? 'Reply to comment' : 'Leave a reply'}
            </h3>
            {replyingTo && (
              <div className="mb-3 text-sm text-gray-500">
                Replying to a comment{' '}
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-primary-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
            <form onSubmit={handleSubmitReply} className="flex gap-4">
              <textarea
                className="input flex-grow"
                rows={3}
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary self-end"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="card mb-8 text-center py-8">
            <p className="text-gray-600 mb-4">Please login to reply</p>
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          </div>
        )}

        {/* Replies */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-6">
            Replies ({post.replies_count})
          </h3>
          {(post as any).replies?.length > 0 ? (
            <div className="space-y-4">
              {(post as any).replies.map((reply: Reply) => (
                <ReplyComponent key={reply.id} reply={reply} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No replies yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
