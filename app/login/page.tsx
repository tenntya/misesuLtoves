'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* 画像を画面全体に散りばめる */}
      <div className="absolute inset-0">
        {/* 左上 */}
        <img
          src="/images/images1.jpg"
          alt=""
          className="absolute w-80 h-60 object-cover rounded-lg shadow-lg"
          style={{ top: '5%', left: '3%', transform: 'rotate(-3deg)' }}
        />
        
        {/* 右上 */}
        <img
          src="/images/images2.jpg"
          alt=""
          className="absolute w-72 h-96 object-cover rounded-lg shadow-lg"
          style={{ top: '8%', right: '5%', transform: 'rotate(5deg)' }}
        />
        
        {/* 左下 */}
        <img
          src="/images/images3.jpg"
          alt=""
          className="absolute w-96 h-64 object-cover rounded-lg shadow-lg"
          style={{ bottom: '10%', left: '8%', transform: 'rotate(-2deg)' }}
        />
        
        {/* 右下 */}
        <img
          src="/images/images4.jpg"
          alt=""
          className="absolute w-64 h-80 object-cover rounded-lg shadow-lg"
          style={{ bottom: '15%', right: '10%', transform: 'rotate(-4deg)' }}
        />
        
        {/* 中央左 */}
        <img
          src="/images/images5.jpg"
          alt=""
          className="absolute w-56 h-72 object-cover rounded-lg shadow-lg"
          style={{ top: '35%', left: '12%', transform: 'rotate(3deg)' }}
        />
      </div>

      {/* 小さなログインフォーム */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-4" style={{ width: '200px' }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Password"
              required
              disabled={loading}
            />

            {error && (
              <div className="text-red-500 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 text-white py-1 px-2 text-sm rounded hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? '...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}