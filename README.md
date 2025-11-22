# IW Shortlink

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**IW Shortlink** is a lightweight URL shortening service built with **Next.js**. It leverages **MockAPI** for backend storage and **FingerprintJS** for persistent visitor identification.

---

## Features

- Shorten URLs with unique codes.
- Track visitor clicks using **FingerprintJS**.
- Store visitor and click data in **MockAPI**.
- Dashboard for viewing click statistics.
- Persistent visitor identification across sessions.

---

## Project Structure

```

src
├─ app
│  ├─ [code]           # Shortlink dynamic page
│  ├─ api              # API routes
│  ├─ dashboard         # Dashboard pages
│  ├─ globals.css       # Global styles
│  ├─ layout.tsx        # App layout
│  └─ page.tsx          # Home page
├─ components
│  ├─ dashboard         # Dashboard components
│  ├─ layout            # Layout components
│  ├─ shortener         # URL shortener components
│  ├─ ui                # Generic UI components
│  └─ Providers.tsx     # Context providers
├─ constants
│  ├─ api.ts            # API base URLs
│  ├─ links.ts          # Link-related constants
│  └─ theme.ts          # Theme constants
├─ contexts
│  ├─ theme-context.tsx
│  └─ visitor-context.tsx
├─ lib
│  ├─ fingerprint.ts    # FingerprintJS integration
│  ├─ mockapi.ts        # MockAPI helper functions
│  └─ utils.ts
└─ styles               # Additional styles

```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=your_base_url_here
MOCKAPI_URL=https://<your_mockapi>.mockapi.io/api/v1
NEXT_PUBLIC_FINGERPRINT_KEY=your_fingerprint_key_here
INTERNAL_API_KEY=generate_a_random_api_key_for_external_access
```

- `NEXT_PUBLIC_BASE_URL`: Base URL of the deployed application.
- `MOCKAPI_URL`: MockAPI endpoint for storing shortlink data.
- `NEXT_PUBLIC_FINGERPRINT_KEY`: FingerprintJS key (can use open-source for development).
- `INTERNAL_API_KEY` : generate a random api key for external access

---

## MockAPI Data Schema

The `links` endpoint stores shortlink records:

```json
{
  "id": "7",
  "code": "p8mcvn",
  "originalUrl": "https://medium.com/@irfannh/rasionalisasi-yang-dibalut-makna-ef55dda782c0",
  "visitorId": "c6cd88b240b25e7d77d4806f05800b7f",
  "clickCount": 0,
  "createdAt": "2025-11-10T07:24:29.232Z",
  "lastClickedAt": ""
}
```

---

## FingerprintJS Integration

```ts
export const VISITOR_STORAGE_KEY = "iwsl_visitor_id";

let fpPromise: Promise<import("@fingerprintjs/fingerprintjs").Agent> | null =
  null;

async function loadFingerprint(): Promise<
  import("@fingerprintjs/fingerprintjs").Agent
> {
  if (typeof window === "undefined")
    throw new Error("FingerprintJS can only be used in the browser.");
  if (!fpPromise)
    fpPromise = import("@fingerprintjs/fingerprintjs").then((module) =>
      module.load()
    );
  return fpPromise;
}

export async function getVisitorId(): Promise<string> {
  const cached = readStorage();
  if (cached) return cached;
  const agent = await loadFingerprint();
  const result = await agent.get();
  writeStorage(result.visitorId);
  return result.visitorId;
}

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(VISITOR_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: string) {
  try {
    window.localStorage.setItem(VISITOR_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}
```

- Stores visitor ID in `localStorage` to maintain persistent tracking.
- Only works in browser environments.

---

## Dependencies

### Runtime

- `next` (16.0.1)
- `react` / `react-dom` (19.2.0)
- `@fingerprintjs/fingerprintjs`
- `axios`
- `swr`
- Radix UI components (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, etc.)
- `lucide-react` (icons)
- `@vercel/analytics`
- `tailwind-merge`, `class-variance-authority`, `clsx`

### Development

- `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
- `eslint`, `eslint-config-next`
- `tailwindcss`, `@tailwindcss/postcss`
- `tw-animate-css`

---

## Constants Example (`src/constants/api.ts`)

```ts
export const MOCKAPI_BASE = process.env.NEXT_PUBLIC_MOCKAPI_URL;
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
```

---

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Start development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

---

## Deployment

Deploy effortlessly on **Vercel**:

- Connect your GitHub repository to Vercel.
- Set the environment variables in Vercel dashboard.
- Deploy; Next.js static optimizations and serverless API routes are supported.

[Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [FingerprintJS Docs](https://fingerprintjs.com/docs)
- [MockAPI Docs](https://mockapi.io/docs)

---

## License

[MIT License](LICENSE)

```

```
