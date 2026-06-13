# CV Builder — Professional CV Creator with AI

A full-stack CV builder built with Next.js 14, PostgreSQL, and Claude AI.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Auth**: NextAuth.js (Google OAuth + Magic Link email)
- **Database**: PostgreSQL on Neon (serverless)
- **ORM**: Prisma
- **AI**: Anthropic Claude API
- **PDF Export**: html2canvas + jsPDF
- **Deployment**: Vercel

## Features

- 4 professional CV templates (Modern, Classic, Minimal, Executive)
- Live preview as you type
- AI-powered suggestions for summaries, achievements, and skills
- One-click PDF export
- User authentication (Google + email magic link)
- Cloud-saved CVs — create multiple versions
- Auto-save

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd cv-builder
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) — free PostgreSQL |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | [console.cloud.google.com](https://console.cloud.google.com) → OAuth 2.0 |
| `AUTH_RESEND_KEY` | [resend.com](https://resend.com) — free email API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |

### 3. Set up the database

```bash
npx prisma db push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cv-builder.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add all environment variables from `.env.example`
4. Deploy!

### 3. Set up database migrations on Vercel

In Vercel project settings → Build & Deployment → Build Command:
```
npx prisma generate && npx prisma db push && next build
```

### 4. Configure Google OAuth

In Google Cloud Console, add these to Authorized redirect URIs:
- `https://your-app.vercel.app/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (for local dev)

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/        # NextAuth handlers
│   │   ├── cv/          # CV CRUD API
│   │   └── ai/          # AI suggestions API
│   ├── auth/signin/     # Sign-in page
│   ├── dashboard/       # CV list dashboard
│   ├── builder/[id]/    # CV editor with live preview
│   └── page.tsx         # Landing page
├── components/
│   └── cv/
│       ├── ModernTemplate.tsx
│       ├── ClassicTemplate.tsx
│       ├── MinimalTemplate.tsx
│       └── CVPreview.tsx
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── prisma.ts        # DB client
│   ├── utils.ts         # Helpers
│   └── exportPDF.ts     # PDF export
└── types/
    └── cv.ts            # TypeScript types
```
