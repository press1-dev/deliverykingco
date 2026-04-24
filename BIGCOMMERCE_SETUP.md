# DeliveryKingco Catalyst Setup

This repository is now bootstrapped from the official BigCommerce Catalyst source.

## What was done

- Installed official Catalyst monorepo files in this repository.
- Installed dependencies with `pnpm install`.
- Created `.env.local` and linked `core/.env.local` to it.
- Set your known channel value:
  - `BIGCOMMERCE_CHANNEL_ID=1851206`

## Required values you still need to fill

Open `.env.local` and replace the following placeholders:

- `BIGCOMMERCE_STORE_HASH`
- `BIGCOMMERCE_STOREFRONT_TOKEN`
- `BIGCOMMERCE_ACCESS_TOKEN` (optional but recommended)
- `BIGCOMMERCE_CLIENT_ID` (optional)
- `BIGCOMMERCE_CLIENT_SECRET` (optional)

## Generate a private storefront token (recommended)

If you do not already have `BIGCOMMERCE_STOREFRONT_TOKEN`, generate one using your store-level API access token:

```bash
curl -sS -X POST "https://api.bigcommerce.com/stores/${BIGCOMMERCE_STORE_HASH}/v3/storefront/api-token-private" \
  -H "X-Auth-Token: ${BIGCOMMERCE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"channel_ids":[1851206]}'
```

Use the returned token value for `BIGCOMMERCE_STOREFRONT_TOKEN`.

## Run locally

```bash
pnpm run dev
```

Catalyst storefront URL:

- `http://localhost:3000`

## Vercel environment variables

Set these in Vercel before first deploy:

- `BIGCOMMERCE_STORE_HASH`
- `BIGCOMMERCE_STOREFRONT_TOKEN`
- `BIGCOMMERCE_CHANNEL_ID=1851206`
- `AUTH_SECRET`
- `TURBO_REMOTE_CACHE_SIGNATURE_KEY`

## Notes

- Redirected checkout for Catalyst does not require a separate Stencil channel.
- Keep `.env.local` out of git (already ignored by `.gitignore`).
