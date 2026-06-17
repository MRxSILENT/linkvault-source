# LinkVault — Personal Bookmark Manager

Save, organize, and access all your favorite website links in one secure place. Each user has a private bookmark collection protected by login authentication.

## Features

- **User Authentication** — Register & login with email/password (NextAuth.js + bcrypt hashing)
- **Private Bookmarks** — Each user's data is completely separate
- **CRUD Operations** — Add, edit, delete bookmarks with title, URL, description, category
- **Auto Favicon** — Automatically fetches website favicons
- **Real-time Search** — Filter by title, URL, or description
- **Category Filtering** — Dynamic category filter buttons
- **Grid & List Views** — Toggle between card and compact list layouts
- **Responsive Design** — Works on mobile and desktop
- **Smooth Animations** — Framer Motion transitions

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: Prisma ORM (SQLite for dev, MongoDB-ready for production)
- **Auth**: NextAuth.js v4 with JWT sessions
- **UI**: shadcn/ui, Tailwind CSS 4, Lucide icons
- **Animations**: Framer Motion

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+ or Bun
- A package manager (npm, yarn, pnpm, or bun)

### Install & Run

```bash
# 1. Install dependencies
npm install
# or
bun install

# 2. Create a .env file in the project root with:
#    DATABASE_URL="file:./dev.db"
#    NEXTAUTH_SECRET="your-random-secret-here"
#    NEXTAUTH_URL="http://localhost:3000"

# 3. Set up the database
npx prisma db push
# or
bun run db:push

# 4. Start the dev server
npm run dev
# or
bun run dev

# 5. Open http://localhost:3000 in your browser
```

## Deploying to GitHub + Vercel (Recommended)

GitHub Pages only hosts static files — since this app needs a backend (auth + database), you must deploy on **Vercel** instead, which is free and integrates directly with GitHub.

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — LinkVault"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/linkvault.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click **"New Project"** → import your `linkvault` repo
   - Framework preset: **Next.js** (auto-detected)
   - Click **"Deploy"**

3. **Add Environment Variables** in Vercel dashboard → Settings → Environment Variables:
   - `DATABASE_URL` = your database connection string (see MongoDB section below)
   - `NEXTAUTH_SECRET` = generate one with `openssl rand -base64 32`
   - `NEXTAUTH_URL` = `https://your-app.vercel.app` (your Vercel domain)

4. **Redeploy** — every push to GitHub now auto-deploys to Vercel.

## Switching to MongoDB (Production)

For production, use MongoDB Atlas (free tier) instead of SQLite.

### Step 1: Create a MongoDB Atlas cluster
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → sign up (free)
2. Create a free M0 cluster
3. Under **Database Access**, create a user with username + password
4. Under **Network Access**, allow `0.0.0.0/0` (or your Vercel IP)
5. Click **Connect** → **Drivers** → copy the connection string
   - Looks like: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/linkvault`

### Step 2: Update Prisma schema
Edit `prisma/schema.prisma` — change the `datasource` block:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String
  password  String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  bookmarks Bookmark[]
}

model Bookmark {
  id          String   @id @default(cuid())
  title       String
  url         String
  description String   @default("")
  category    String   @default("Uncategorized")
  favicon     String   @default("")
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([category])
}
```

### Step 3: Update .env
```
DATABASE_URL="mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/linkvault?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### Step 4: Push schema to MongoDB
```bash
npx prisma db push
# or
bun run db:push
```

### Step 5: Deploy to Vercel
Add the same env vars to Vercel, then redeploy.

## Project Structure

```
linkvault/
├── prisma/
│   └── schema.prisma          # Database schema (User + Bookmark models)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   │   ├── register/route.ts         # User registration
│   │   │   │   └── session-check/route.ts    # Session validator
│   │   │   └── bookmarks/
│   │   │       ├── route.ts                  # GET, POST, DELETE all
│   │   │       └── [id]/route.ts             # GET, PUT, DELETE one
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                          # Main app (login + dashboard)
│   ├── components/ui/                        # shadcn/ui components
│   ├── hooks/
│   └── lib/
│       ├── auth.ts                           # NextAuth config
│       ├── db.ts                             # Prisma client
│       └── utils.ts
├── public/
├── .env                                      # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run db:push` — push schema changes to database
- `npm run db:generate` — regenerate Prisma client

## Security Notes

- Passwords are hashed with bcrypt (12 rounds) before storage
- Sessions use JWT tokens with a 30-day expiry
- Each bookmark query is scoped to the authenticated user's ID
- **Important**: Always set a strong `NEXTAUTH_SECRET` in production
- **Important**: Never commit your `.env` file to GitHub (it's in `.gitignore`)

## License

MIT — free to use, modify, and distribute.
