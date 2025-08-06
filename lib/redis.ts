import { kv } from '@vercel/kv';

export const redis = kv;

// Vercel KVが設定されていない場合のモック（インメモリストレージ）
const mockStorage = new Map<string, any>();
const mockSortedSet = new Map<string, Array<{score: number, member: string}>>();

export const mockRedis = {
  get: async (key: string) => mockStorage.get(key) || null,
  set: async (key: string, value: any, options?: any) => {
    mockStorage.set(key, value);
    // EXオプションがある場合、タイマーで自動削除（モック実装）
    if (options?.ex) {
      setTimeout(() => {
        mockStorage.delete(key);
      }, options.ex * 1000);
    }
    return 'OK';
  },
  del: async (key: string) => {
    mockStorage.delete(key);
    return 1;
  },
  expire: async (key: string, seconds: number) => {
    // モックでは期限切れを実装しない
    return 1;
  },
  zadd: async (key: string, ...args: any[]) => {
    const score = args[0];
    const member = args[1];
    if (!mockSortedSet.has(key)) {
      mockSortedSet.set(key, []);
    }
    const set = mockSortedSet.get(key)!;
    set.push({ score, member });
    set.sort((a, b) => a.score - b.score);
    return 1;
  },
  zrange: async (key: string, start: number, stop: number, options?: any) => {
    const set = mockSortedSet.get(key) || [];
    let items = [...set];
    
    // 負のインデックスの処理
    const len = items.length;
    const actualStart = start < 0 ? Math.max(0, len + start) : start;
    const actualStop = stop < 0 ? len + stop : stop;
    
    // スライス取得
    items = items.slice(actualStart, actualStop + 1);
    
    return items.map(item => item.member);
  },
  zrem: async (key: string, member: string) => {
    const set = mockSortedSet.get(key);
    if (set) {
      const index = set.findIndex(item => item.member === member);
      if (index !== -1) {
        set.splice(index, 1);
        return 1;
      }
    }
    return 0;
  },
  zremrangebyscore: async (key: string, min: number, max: number) => {
    const set = mockSortedSet.get(key);
    if (set) {
      const before = set.length;
      mockSortedSet.set(key, set.filter(item => item.score < min || item.score > max));
      return before - (mockSortedSet.get(key)?.length || 0);
    }
    return 0;
  },
};

// 環境に応じて実際のRedisまたはモックを使用
export function getRedisClient() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    console.log('Using Vercel KV'); // デバッグ用
    return redis;
  }
  console.warn('Vercel KV is not configured. Using mock Redis.');
  console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL ? 'Set' : 'Not set'); // デバッグ用
  console.log('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN ? 'Set' : 'Not set'); // デバッグ用
  return mockRedis;
}