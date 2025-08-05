'use client';

import { useState } from 'react';

interface PostFormProps {
  onPostCreated: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('');
        onPostCreated();
      } else {
        setError(data.error || '投稿に失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="メッセージを入力（最大1000文字）"
          rows={3}
          maxLength={1000}
          required
          disabled={loading}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {message.length} / 1000
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || message.trim().length === 0}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
}