import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '1日で消える掲示板',
  description: 'シンプルな時限式掲示板',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}