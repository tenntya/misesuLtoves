'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ランダムな画像検索サイトのURL
  const randomImageSites = [
    'https://unsplash.com',
    'https://www.pexels.com',
    'https://pixabay.com',
    'https://www.shutterstock.com',
    'https://www.gettyimages.com',
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: searchQuery }),
      });

      if (response.ok) {
        // 正しいパスワード：掲示板へ
        router.push('/');
      } else {
        // 間違ったパスワード：ランダムな画像サイトへ
        const randomSite = randomImageSites[Math.floor(Math.random() * randomImageSites.length)];
        window.location.href = randomSite;
      }
    } catch (error) {
      // エラー時もランダムなサイトへ
      const randomSite = randomImageSites[Math.floor(Math.random() * randomImageSites.length)];
      window.location.href = randomSite;
    }
  };

  const images = [
    { src: '/images/images1.jpg', title: 'Nature Photography', tags: 'landscape, mountains, sunset' },
    { src: '/images/images2.jpg', title: 'Urban Life', tags: 'city, architecture, street' },
    { src: '/images/images3.jpg', title: 'Wildlife', tags: 'animals, nature, photography' },
    { src: '/images/images4.jpg', title: 'Abstract Art', tags: 'creative, colorful, design' },
    { src: '/images/images5.jpg', title: 'Travel Photography', tags: 'adventure, culture, explore' },
    { src: '/images/images6.jpg', title: 'Portraits', tags: 'people, emotion, human' },
    { src: '/images/images7.jpg', title: 'Food Photography', tags: 'cuisine, delicious, restaurant' },
    { src: '/images/images8.jpg', title: 'Technology', tags: 'digital, innovation, future' },
    { src: '/images/images9.jpg', title: 'Fashion', tags: 'style, trendy, clothing' },
    { src: '/images/images10.jpg', title: 'Sports', tags: 'action, fitness, competition' },
    { src: '/images/images11.jpg', title: 'Architecture', tags: 'buildings, design, structure' },
    { src: '/images/images12.jpg', title: 'Vintage', tags: 'retro, classic, nostalgic' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー with 検索バー */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-8">
            {/* ロゴ */}
            <h1 className="text-2xl font-bold text-gray-800">ImageStock</h1>
            
            {/* 検索バー */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
                  placeholder="Search for images..."
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* ナビゲーション */}
            <nav className="hidden lg:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Explore</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">License</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Upload</a>
            </nav>
          </div>
        </div>
      </header>

      {/* カテゴリータブ */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto py-3">
            <button className="text-gray-900 font-medium whitespace-nowrap pb-3 border-b-2 border-gray-900">All</button>
            <button className="text-gray-600 hover:text-gray-900 whitespace-nowrap pb-3">Photos</button>
            <button className="text-gray-600 hover:text-gray-900 whitespace-nowrap pb-3">Illustrations</button>
            <button className="text-gray-600 hover:text-gray-900 whitespace-nowrap pb-3">Vectors</button>
            <button className="text-gray-600 hover:text-gray-900 whitespace-nowrap pb-3">Videos</button>
          </div>
        </div>
      </div>

      {/* 画像グリッド */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg cursor-pointer">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold">{image.title}</h3>
                  <p className="text-sm opacity-90">{image.tags}</p>
                </div>
              </div>
              {/* ダウンロードボタン */}
              <button className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* もっと見る */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Load More Images
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">© 2024 ImageStock. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}