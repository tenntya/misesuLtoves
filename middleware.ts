import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData } from './lib/auth';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ログインページとAPIルートはスキップ
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/auth/login')
  ) {
    return response;
  }

  // その他のAPIルートとメインページは認証チェック
  if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    try {
      const session = await getIronSession<SessionData>(request.cookies, {
        password: process.env.SESSION_SECRET!,
        cookieName: 'ephemeral-board-session',
      });

      if (!session.isLoggedIn) {
        // APIルートの場合は401を返す
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: '認証が必要です' },
            { status: 401 }
          );
        }
        
        // ページの場合はログインページにリダイレクト
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'サーバーエラー' },
          { status: 500 }
        );
      }
      
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};