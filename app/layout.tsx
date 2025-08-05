import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Private Board',
  description: 'Members Only',
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