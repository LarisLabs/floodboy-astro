# FloodBoy Astro - Deployment Guide

## Overview

| Field | Value |
|-------|-------|
| **Repository** | [LarisLabs/floodboy-astro](https://github.com/LarisLabs/floodboy-astro) |
| **Production URL** | https://blockchain.floodboy.online |
| **Workers URL** | https://floodboy-astro.laris.workers.dev |
| **Platform** | Cloudflare Workers |
| **Framework** | Astro + @astrojs/cloudflare |

---

## Deploy Methods

### 1. Auto-Deploy (Recommended)

Push to `main` branch triggers Cloudflare Workers Builds automatically.

```bash
git add .
git commit -m "your changes"
git push origin main
```

Cloudflare Workers Builds will:
1. Detect the push
2. Run `pnpm build`
3. Deploy to production

**Monitor**: Check [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → floodboy-astro → Deployments

### 2. Manual Deploy (CLI)

Use when auto-deploy fails or for quick fixes.

```bash
cd /Users/nat/Code/github.com/LarisLabs/floodboy-astro

# Build first (required!)
pnpm build

# Deploy
npx wrangler deploy
```

**Note**: Manual deploy overwrites auto-deploy. Last deploy wins.

---

## Cloudflare Configuration

### Account Details

| Account | Account ID | Status |
|---------|------------|--------|
| Larisara@gmail.com | `96111b7e637ce78c675d5de1221c820b` | Wrong |
| **Nat.wrw@gmail.com** | `a5eabdc2b11aae9bd5af46bd6a88179e` | **Target** |
| Thanwa | `246ff795de8d6fd1c8698f60cc7e2cf3` | Wrong |

### wrangler.json

```json
{
  "name": "floodboy-astro",
  "account_id": "a5eabdc2b11aae9bd5af46bd6a88179e",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "./dist/_worker.js/index.js",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  },
  "upload_source_maps": true,
  "workers_dev": true
}
```

**Critical**: The `account_id` field ensures deployment goes to correct Cloudflare account.

### Custom Domain Setup

| Domain | Type | Target |
|--------|------|--------|
| blockchain.floodboy.online | CNAME | floodboy-astro.laris.workers.dev |

Configure in Cloudflare Dashboard → Workers & Pages → floodboy-astro → Settings → Domains & Routes

---

## Verify Deployment

### Check Account

```bash
npx wrangler whoami
```

Should show `Nat.wrw@gmail.com's Account` with ID `a5eabdc2b11aae9bd5af46bd6a88179e`.

### Check Deployment

```bash
npx wrangler deployments list
```

### Check Live Site

1. Visit https://blockchain.floodboy.online
2. Check header status bar:
   - **Git**: Shows commit hash (e.g., `3e6cdee`)
   - **RPC**: Shows active RPC endpoint
   - **Block**: Shows live block number
   - **Load**: Shows page load time

---

## Troubleshooting

### Auto-Deploy Not Working

1. Check CF Dashboard → Workers & Pages → floodboy-astro → Settings → Builds & Deployments
2. Verify GitHub repo is connected
3. Check build logs for errors

### Manual Deploy to Wrong Account

**Symptom**: Deploy succeeds but changes don't appear on production.

**Fix**: Ensure `account_id` in wrangler.json matches target account:
```json
"account_id": "a5eabdc2b11aae9bd5af46bd6a88179e"
```

### Build Fails

```bash
# Clean and rebuild
rm -rf dist node_modules/.cache
pnpm build
```

### Assets Not Updating

Always run `pnpm build` before `npx wrangler deploy`. The deploy command only uploads built assets from `dist/`.

---

## Development Workflow

### Local Development

```bash
pnpm dev          # Start dev server at http://localhost:4321
pnpm build        # Build for production
pnpm preview      # Preview production build locally
```

### Testing

```bash
pnpm test         # Run E2E tests locally
pnpm test:prod    # Run tests against production
```

### Full Deploy Cycle

```bash
# 1. Make changes
# 2. Test locally
pnpm dev

# 3. Build and test
pnpm build
pnpm preview

# 4. Commit and push (auto-deploy)
git add .
git commit -m "feat: your feature"
git push origin main

# 5. Verify on production
open https://blockchain.floodboy.online
```

---

## Environment Variables

| Variable | Description | Where |
|----------|-------------|-------|
| None required | Static site with client-side RPC | N/A |

RPC endpoints are configured client-side via localStorage (`floodboy_preferred_rpc`).

---

## Related Documentation

- [README.md](README.md) - Project overview
- [CLAUDE.md](CLAUDE.md) - AI assistant context
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)

---

## Contact

For deployment issues:
- **GitHub Issues**: [LarisLabs/floodboy-astro/issues](https://github.com/LarisLabs/floodboy-astro/issues)
- **Oracle**: Tracked by `laris-co/floodboy-oracle`

---

*Last updated: 2026-01-29*
