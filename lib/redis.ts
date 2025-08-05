import { kv } from '@vercel/kv';

export const redis = kv;

// Vercel KVが設定されていない場合のモック
export const mockRedis = {
  get: async (key: string) => null,
  set: async (key: string, value: any, options?: any) => 'OK',
  del: async (key: string) => 1,
  expire: async (key: string, seconds: number) => 1,
  zadd: async (key: string, score: number, member: string) => 1,
  zrange: async (key: string, start: number, stop: number, options?: any) => [],
  zrem: async (key: string, member: string) => 1,
};

// 環境に応じて実際のRedisまたはモックを使用
export function getRedisClient() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return redis;
  }
  console.warn('Vercel KV is not configured. Using mock Redis.');
  return mockRedis;
}