# SES Career Analyzer

SESエンジニア向けの個人分析・スキルシート分析・将来キャリア分析・案件面談対策Webアプリです。

## 技術スタック

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL 16 + Prisma
- iron-session + bcryptjs
- OpenAI API

## セットアップ

```bash
# 依存関係インストール
npm install

# PostgreSQL起動
docker compose up -d

# DBスキーマ反映
npm run db:push

# 質問マスタ投入（100問）
npm run db:seed

# 開発サーバー起動
npm run dev
```

## 環境変数

`.env.example` を `.env` にコピーして設定してください。

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | PostgreSQL接続URL |
| `SESSION_SECRET` | 32文字以上のランダム文字列 |
| `OPENAI_API_KEY` | OpenAI APIキー（未設定時は開発環境でモック応答） |
| `APP_BASE_URL` | パスワード再設定リンクのベースURL |

## 主な機能

- ユーザー登録・ログイン・ログアウト・パスワード再設定
- 100問の個人分析（レーダーチャート・棒グラフ・AIコメント）
- Excelスキルシート読み取り・構造化・編集
- 将来分析（1〜3年後ロードマップ）
- 案件対策（自己紹介・想定Q&A・逆質問）
- 履歴保存・PDF出力・コピー機能

## 保護ルート

ログイン必須: `/dashboard`, `/analysis`, `/skill-sheet`, `/future-analysis`, `/project-preparation`, `/history`
