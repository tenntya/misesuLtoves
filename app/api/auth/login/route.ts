import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'パスワードが必要です' },
        { status: 400 }
      );
    }

    const success = await login(password);

    if (success) {
      return NextResponse.json(
        { success: true, message: 'ログインしました' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'パスワードが間違っています' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}