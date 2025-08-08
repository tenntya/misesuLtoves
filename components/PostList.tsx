'use client';

import { useEffect, useState, useRef } from 'react';
import TimeRemaining from './TimeRemaining';
import { Post } from '@/lib/posts';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    }
    
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
      if (showRefreshIndicator) {
        // 少し遅延させてからリフレッシュインジケーターを非表示
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // タッチ開始位置を記録
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  // タッチ移動を検知
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  // タッチ終了時に下引きリフレッシュを判定
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isScrolledToTop = containerRef.current?.scrollTop === 0;
    const isPullDown = distance < -100; // 100px以上下に引いた場合
    
    if (isScrolledToTop && isPullDown && !isRefreshing) {
      fetchPosts(true);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // 3分ごとに投稿を更新（リクエスト数削減のため）
    const interval = setInterval(() => fetchPosts(), 180000);
    
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
    <div 
      ref={containerRef}
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* リフレッシュインジケーター */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex justify-center py-4 bg-blue-50">
          <div className="flex items-center space-x-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">更新中...</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isRefreshing ? 'mt-16' : ''}`}>
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
    </div>
  );
}