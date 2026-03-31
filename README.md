# Hello Idea

Single-page Next.js app for hello-idea.co.

## What this does

- Lets a visitor type a rough idea
- Clarifies the idea
- Surfaces the purpose behind it
- Gives a fresh perspective when they get stuck

## Before you start

You need:

1. A Vercel account
2. A GitHub account
3. Your domain login for hello-idea.co
4. An OpenAI API key
5. A model name you have access to in your OpenAI account

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`

## Vercel deploy

1. Put this project into a new GitHub repo
2. Log in to Vercel
3. Click **Add New Project**
4. Import your GitHub repo
5. In Vercel, add these environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
6. Deploy

## Connect your domain

1. In Vercel open your project
2. Go to **Settings** → **Domains**
3. Add:
   - `hello-idea.co`
   - `www.hello-idea.co`
4. Vercel will tell you exactly which DNS records to add at your domain registrar
5. Save those DNS records where you bought the domain

## Important

Never put your OpenAI API key in the browser or in public code.
It must stay in Vercel environment variables only.
