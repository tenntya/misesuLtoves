'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';

export default function HomePage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePostCreated = () => {
    // PostListを強制的に更新
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">1日で消える掲示板</h1>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              ログアウト
            </button>
          </div>
          <p className="text-gray-600">
            投稿は2時間後に自動的に削除されます
          </p>
        </header>

        <main>
          <PostForm onPostCreated={handlePostCreated} />
          <PostList key={refreshKey} />
        </main>
      </div>
    </div>
  );
}