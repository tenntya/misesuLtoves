'use client';

import { useEffect, useState } from 'react';
import TimeRemaining from './TimeRemaining';
import { Post } from '@/lib/posts';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setError('');
      } else {
        setError('投稿の取得に失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // 30秒ごとに投稿を更新
    const interval = setInterval(fetchPosts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        まだ投稿がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="mb-2">
            <p className="whitespace-pre-wrap break-words">{post.message}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleString('ja-JP')}
            </time>
            <TimeRemaining expiresAt={post.expires_at} />
          </div>
        </div>
      ))}
    </div>
  );
}