import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // ログインページとAPIルートはスキップ
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/auth/login')
  ) {
    return NextResponse.next();
  }

  // メインページへのアクセス時、セッションクッキーがない場合はログインページにリダイレクト
  if (request.nextUrl.pathname === '/') {
    const sessionCookie = request.cookies.get('ephemeral-board-session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};