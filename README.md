# 1日で消える掲示板

シンプルなパスワード認証付きの掲示板アプリケーション。投稿は2時間後に自動的に削除されます。

## 機能

- パスワード認証によるアクセス制限
- テキストメッセージの投稿
- 投稿の自動削除（2時間後）
- リアルタイム更新（30秒ごと）
- モバイル対応のレスポンシブデザイン

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、必要な値を設定してください：

```bash
cp .env.local.example .env.local
```

必要な環境変数：
- `BOARD_PASSWORD`: 掲示板にアクセスするためのパスワード
- `SESSION_SECRET`: セッション暗号化用のシークレットキー（32文字以上）
- `POST_EXPIRY_HOURS`: 投稿の有効時間（デフォルト: 2時間）

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## Vercel KVの設定（本番環境）

1. Vercelプロジェクトを作成
2. Vercel KV（Redis）をプロジェクトに追加
3. 環境変数を自動的に取得：

```bash
vercel env pull
```

## デプロイ

```bash
vercel
```

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Vercel KV (Redis)
- iron-session