# 🏛️ UrbanPolicy AI

> AI-powered urban policy document drafting tool built with React + Anthropic Claude API

## Live Demo
[urban-policy-ai.vercel.app](https://urban-policy-ai.vercel.app) ← add your URL here after deploying

---

## What It Does
Generates professional government policy documents (Action Plans, Ordinances, Budget Proposals, etc.) for 8 urban sectors using the Anthropic Claude API. Users configure the sector, city, document type, tone, and challenge — and receive a full 10-section policy document instantly.

## Tech Stack
- **Frontend**: React 18 + Vite
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Backend**: Vercel Serverless Functions (API proxy)
- **Deployment**: Vercel

---

## Project Structure
```
urban-policy-ai/
├── api/
│   └── generate.js     ← Serverless function (secure API proxy)
├── src/
│   ├── App.jsx         ← Main React component
│   └── main.jsx        ← React entry point
├── index.html          ← HTML shell
├── vite.config.js      ← Vite build config
├── package.json        ← Dependencies
├── .env.example        ← Environment variable template
└── .gitignore
```

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/urban-policy-ai.git
cd urban-policy-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 4. Run locally using Vercel CLI (recommended — mirrors production)
npm install -g vercel
vercel dev

# OR run Vite dev server (frontend only)
npm run dev
```

---

## Deploy to Vercel

```bash
# Option A: Via Vercel CLI
npm install -g vercel
vercel

# Option B: Via GitHub
# Push to GitHub → Import on vercel.com → Auto-deploy
```

### Add Environment Variable on Vercel
1. Go to vercel.com → Your Project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = `sk-ant-xxxxxxxxxxxx`
3. Redeploy

---

## Capstone Project Info
- **Domain**: Generative AI for Urban Governance
- **Techniques**: Prompt Engineering, LLM API Integration, React Hooks, Serverless Functions
- **Use Case**: Policy document automation for city planners and public administrators
