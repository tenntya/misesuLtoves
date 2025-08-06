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
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
        <header className="p-4 flex-shrink-0">
          <div className="flex justify-end items-center">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              ログアウト
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 pb-4">
          <div className="mb-4">
            <PostForm onPostCreated={handlePostCreated} />
          </div>
          <PostList key={refreshKey} />
        </main>
      </div>
    </div>
  );
}