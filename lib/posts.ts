import { nanoid } from 'nanoid';
import { getRedisClient } from './redis';

export interface Post {
  id: string;
  message: string;
  created_at: string;
  expires_at: string;
}

const POSTS_KEY = 'posts:ids';
const POST_PREFIX = 'post:';
const POST_EXPIRY_HOURS = parseInt(process.env.POST_EXPIRY_HOURS || '2', 10);

export async function createPost(message: string): Promise<Post> {
  const redis = getRedisClient();
  const id = nanoid();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + POST_EXPIRY_HOURS * 60 * 60 * 1000);

  const post: Post = {
    id,
    message: message.trim(),
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  // 投稿をRedisに保存
  await redis.set(`${POST_PREFIX}${id}`, JSON.stringify(post));
  
  // 自動削除の設定（秒単位）
  await redis.expire(`${POST_PREFIX}${id}`, POST_EXPIRY_HOURS * 60 * 60);
  
  // 投稿IDをソートセットに追加（スコアはタイムスタンプ）
  // @ts-ignore - Vercel KVのzaddは可変長引数を受け取る
  await redis.zadd(POSTS_KEY, now.getTime(), id);

  return post;
}

export async function getPosts(limit: number = 30): Promise<Post[]> {
  const redis = getRedisClient();
  
  try {
    // 最新の投稿IDを取得（降順） - Vercel KVの正しい構文
    // @ts-ignore
    const postIds = await redis.zrange(POSTS_KEY, -limit, -1);
    
    console.log('Post IDs from zrange:', postIds); // デバッグ用
    
    if (!postIds || postIds.length === 0) {
      return [];
    }

    const posts: Post[] = [];
    
    // 降順にするため配列を逆転
    const reversedIds = [...postIds].reverse();
    
    for (const id of reversedIds) {
      const postData = await redis.get(`${POST_PREFIX}${id}`);
      
      if (postData) {
        try {
          const post = JSON.parse(postData as string) as Post;
          posts.push(post);
        } catch (error) {
          console.error(`Failed to parse post ${id}:`, error);
          // 無効な投稿をソートセットから削除
          await redis.zrem(POSTS_KEY, String(id));
        }
      } else {
        console.log(`Post not found: ${POST_PREFIX}${id}`); // デバッグ用
        // 存在しない投稿をソートセットから削除
        await redis.zrem(POSTS_KEY, String(id));
      }
    }

    return posts;
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
}

// 期限切れの投稿IDをソートセットから削除（オプション）
export async function cleanupExpiredPostIds(): Promise<number> {
  const redis = getRedisClient();
  const now = Date.now();
  const expiredTime = now - (POST_EXPIRY_HOURS * 60 * 60 * 1000);
  
  // 期限切れの投稿IDを削除
  const removed = await redis.zremrangebyscore(POSTS_KEY, 0, expiredTime);
  
  return removed as number;
}