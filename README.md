# 🚀 Creata AI — Setup Guide

A premium AI-powered viral content generator for Instagram Reels & YouTube Shorts.

---

## 📁 Project Structure

```
creata-ai/
├── pages/
│   ├── _app.tsx          # App wrapper (fonts, auth provider, toasts)
│   ├── _document.tsx     # HTML document head
│   ├── index.tsx         # Landing page
│   ├── auth.tsx          # Sign In / Sign Up page
│   ├── dashboard.tsx     # Main content generator
│   ├── history.tsx       # Content history page
│   └── api/
│       ├── generate.ts   # OpenAI + YouTube → content generation
│       └── trending.ts   # YouTube trending videos API
├── components/
│   ├── OutputSection.tsx # Generated content display cards
│   └── ShimmerLoader.tsx # Loading skeleton animation
├── lib/
│   ├── firebase.ts       # Firebase app initialization
│   ├── AuthContext.tsx   # Auth state + Google/Email sign-in
│   ├── history.ts        # Firestore read/write helpers
│   └── types.ts          # TypeScript interfaces
├── styles/
│   └── globals.css       # Tailwind + custom CSS variables
├── .env.example          # Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ✅ Step 1 — Install Node.js

1. Visit **https://nodejs.org**
2. Download the **LTS** version (v20 or higher recommended)
3. Install it and verify:

```bash
node -v   # should show v20.x.x
npm -v    # should show 10.x.x
```

---

## ✅ Step 2 — Create the Project

You can either clone this folder directly, or create a fresh Next.js project:

```bash
# Option A: Use this downloaded folder
cd creata-ai
npm install

# Option B: Create fresh (then copy these files in)
npx create-next-app@latest creata-ai --typescript --tailwind --eslint
cd creata-ai
```

---

## ✅ Step 3 — Install Dependencies

```bash
npm install framer-motion firebase openai axios lucide-react react-hot-toast date-fns
```

---

## ✅ Step 4 — Set Up Firebase

Firebase handles **user authentication** (email/Google) and **Firestore** (saving history).

### 4a. Create a Firebase Project
1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → name it `creata-ai`
3. Disable Google Analytics (optional) → **Create project**

### 4b. Enable Authentication
1. In Firebase Console → **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** → Save
4. Enable **Google** → add your support email → Save

### 4c. Create Firestore Database
1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** → select your region → Done
3. Go to **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /history/{docId} {
      allow read, write, delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

### 4d. Get Firebase Config Keys
1. In Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **"</>** (Web)" → Register app
3. Copy the `firebaseConfig` values

---

## ✅ Step 5 — Get YouTube Data API Key

1. Go to **https://console.cloud.google.com**
2. Create a new project or select existing
3. Go to **APIs & Services** → **Library**
4. Search **"YouTube Data API v3"** → Enable it
5. Go to **APIs & Services** → **Credentials**
6. Click **+ Create Credentials** → **API Key**
7. Copy your API key

> ⚠️ Restrict your API key to only YouTube Data API v3 for security.

---

## ✅ Step 6 — Get OpenAI API Key

1. Go to **https://platform.openai.com**
2. Sign up / Log in
3. Click your profile → **API Keys**
4. Click **+ Create new secret key**
5. Copy the key (you can only see it once!)

> 💡 Make sure you have billing set up on OpenAI. GPT-4o-mini is very cheap (~$0.00015/1K tokens).

---

## ✅ Step 7 — Configure Environment Variables

1. Copy the template file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in all values:

```env
OPENAI_API_KEY=sk-proj-...your-key...

YOUTUBE_API_KEY=AIza...your-key...

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

> 🔒 **Never commit `.env.local` to git.** It's already in `.gitignore`.

---

## ✅ Step 8 — Run Locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the Creata AI landing page!

---

## ✅ Step 9 — Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps — it's free to start.

### 9a. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/creata-ai.git
git push -u origin main
```

### 9b. Deploy on Vercel
1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"New Project"** → Import your `creata-ai` repo
3. In **Environment Variables**, add all your `.env.local` keys
4. Click **Deploy** 🎉

Your app will be live at `https://creata-ai.vercel.app` (or similar)!

---

## 🔧 Common Issues & Fixes

| Problem | Fix |
|--------|-----|
| Firebase: auth/unauthorized-domain | Add your domain in Firebase → Authentication → Settings → Authorized domains |
| YouTube API 403 error | Check your API key is enabled for YouTube Data API v3 |
| OpenAI 429 (rate limit) | Add billing to your OpenAI account |
| Hydration errors | Make sure you're not using `localStorage` directly in SSR components |
| Firestore permission denied | Double-check your Firestore security rules |

---

## 💡 Tips for Going Viral

- **Instagram Reels**: Use emotional/relatable hooks, keep scripts under 30s
- **YouTube Shorts**: Lead with value, add SEO keywords in caption
- **Best niches for 2025**: AI, Money mindset, Fitness transformations
- **Post timing**: 6-9 AM and 7-10 PM in your audience's timezone

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React 18 |
| Styling | Tailwind CSS + Framer Motion |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI | OpenAI GPT-4o-mini |
| Trend Data | YouTube Data API v3 |
| Deployment | Vercel |

---

Made with ❤️ by Creata AI
