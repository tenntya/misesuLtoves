import { NextRequest, NextResponse } from 'next/server';
import { createPost, getPosts } from '@/lib/posts';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const posts = await getPosts();
    console.log('Retrieved posts:', posts.length); // デバッグ用
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: '投稿の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: 'メッセージを入力してください' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 1000) {
      return NextResponse.json(
        { error: 'メッセージは1000文字以内で入力してください' },
        { status: 400 }
      );
    }

    const post = await createPost(trimmedMessage);
    console.log('Created post:', post); // デバッグ用
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: '投稿の作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}