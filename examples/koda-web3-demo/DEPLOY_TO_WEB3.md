# Deploying Koda Web3 Showcase to 4EVERLAND 🚀

This guide explains how to deploy this "Sovereign Dashboard" to the Web3 network using 4EVERLAND, a decentralized hosting platform (similar to Vercel but for Web3).

## Prerequisites
- A GitHub account.
- A 4EVERLAND account (Login with GitHub/Wallet).

## Steps

### 1. Build the Static Chassis
First, generate the static files for the dashboard.
```bash
cd examples/koda-web3-demo
bun install
bun run build
```
This will create a `dist/` folder containing your `index.html` and assets.

### 2. Deployment Method A: GitHub Integration (Recommended)
1. Push this `examples/koda-web3-demo` project to a GitHub repository.
2. Go to **[4EVERLAND Dashboard](https://dashboard.4everland.org)**.
3. Click "New Project" -> "Connect GitHub".
4. Select your repository.
5. **Configuration**:
   - **Root Directory**: `examples/koda-web3-demo`
   - **Framework**: `Vite`
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Output Directory**: `dist`
6. Click **Deploy**.

### 3. Deployment Method B: IPFS Upload (Manual)
1. Install IPFS Desktop or use a CLI tool to upload the `dist/` folder.
2. You will get a Content ID (CID) like `QmXyZ...`.
3. Your dashboard is now permanently accessible via `https://ipfs.io/ipfs/QmXyZ...`.

## Why This Matters?
By deploying this way, you have proven that:
1. **Koda UI (Chassis)** works without a central server.
2. **Koda Logic** is decoupled from node/bun runtimes for client-side interactions.
3. Your application is now **Unstoppable**.

> "The Zenith is not just about code. It is about sovereignty."
