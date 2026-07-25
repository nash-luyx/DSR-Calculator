# Cloudflare Pages & Cloudflare Workers Deployment Guide

This project is a React 18 + TypeScript application built with **Vite** and **Tailwind CSS**.

---

## ⚡ CRITICAL: Cloudflare Pages Build Settings

When deploying to **Cloudflare Pages**, you **MUST** configure the Build Settings in the Cloudflare Dashboard so that Cloudflare runs `npm run build` and serves the `dist` directory.

### Cloudflare Pages Dashboard Settings:

| Setting | Required Value |
| :--- | :--- |
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | `18` or `20` (Default) |

> ⚠️ **Why this is required**: If Build Command is left blank or output directory is set to `/` (root), Cloudflare will serve raw source files (like `/src/index.tsx`) directly to browsers, causing MIME type / script errors. Running `npm run build` produces the compiled, minified bundle in `dist/`.

---

## 📁 Project Structure & Config Files

- `package.json` – Contains `"build": "vite build"` script and dependencies.
- `vite.config.js` – Vite bundler configuration (`outDir: 'dist'`).
- `index.html` – Vite entry file pointing to `/src/index.tsx`.
- `wrangler.jsonc` – Cloudflare Workers static assets configuration (`assets.directory: "./dist"`).
- `tsconfig.json`, `tailwind.config.js`, `postcss.config.js` – Build tooling configs.

---

## 🚀 How to Deploy

### Option A: Cloudflare Pages (Recommended for GitHub repos)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

### Option B: Cloudflare Workers / Wrangler CLI
```bash
# 1. Install dependencies
npm install

# 2. Build production bundle locally
npm run build

# 3. Deploy to Cloudflare
npx wrangler deploy
```
