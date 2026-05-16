# AGENTS.md

> This file is intended for AI coding agents. It describes the actual state of the project as discovered from the codebase. Do not make assumptions beyond what is documented here.

## Project Overview

This is a **Next.js 16** web application built with the App Router. It serves as a cultural platform for **Mohammed Ayedh Al-Zahrani (محمد عيضة الزهراني)**, a poet and researcher of folk heritage. The user interface is entirely in **Arabic** and renders in **RTL** mode.

The site has been upgraded to a full-stack Next.js application with API routes, MongoDB database, and JWT-based authentication. All content is now served from the backend via REST API endpoints.

## Technology Stack

| Layer | Technology | Version / Notes |
|-------|------------|-----------------|
| Framework | Next.js | `16.2.4` (App Router) |
| Runtime | React | `^19` |
| Language | TypeScript | `5.7.3` (strict mode) |
| Styling | Tailwind CSS | `v4.2.0` (CSS-first config, no `tailwind.config.js`) |
| PostCSS | `@tailwindcss/postcss` | Configured in `postcss.config.mjs` |
| UI Primitives | shadcn/ui | Style: `new-york`, RSC enabled, CSS variables, base color `neutral` |
| Headless UI | Radix UI | Extensive use across `components/ui/` |
| Animation | `framer-motion` | Client-side animations |
| Icons | `lucide-react` | All icons sourced from Lucide |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` | Validation and form handling |
| Carousel | `embla-carousel-react` | Used in relevant pages |
| Charts | `recharts` | Data visualizations |
| Dates | `date-fns` + `react-day-picker` | Date formatting and picking |
| Themes | `next-themes` | Dark/light mode support |
| Analytics | `@vercel/analytics` | Injected in production only |
| Database | MongoDB + Mongoose | Content storage via ODM |
| Auth | JWT + bcryptjs | HTTP-only cookies |
| File Storage | Cloudflare R2 | Video uploads via presigned URLs |
| AWS SDK | `@aws-sdk/client-s3` | R2 S3-compatible uploads |

## Project Structure

```
app/                          # Next.js App Router
├── layout.tsx                # Root layout: lang="ar", dir="rtl", metadata, Vercel Analytics
├── page.tsx                  # Home page
├── globals.css               # ACTIVE global stylesheet (Tailwind v4 imports, custom theme, utilities)
├── api/                      # API Routes (REST backend)
│   ├── auth/login/route.ts   # Admin login → JWT cookie
│   ├── auth/me/route.ts      # Auth check
│   ├── auth/logout/route.ts  # Clear cookie
│   ├── upload/presign/route.ts  # R2 presigned URL for video upload
│   ├── videos/route.ts       # CRUD for videos
│   ├── videos/[id]/route.ts
│   ├── poems/route.ts        # CRUD for poems
│   ├── poems/[id]/route.ts
│   ├── articles/route.ts     # CRUD for articles
│   ├── articles/[id]/route.ts
│   ├── proverbs/route.ts     # CRUD for proverbs
│   ├── proverbs/[id]/route.ts
│   ├── dictionary/route.ts   # CRUD for dictionary
│   ├── dictionary/[id]/route.ts
│   ├── audio/route.ts        # CRUD for audio
│   ├── audio/[id]/route.ts
│   ├── history/route.ts      # CRUD for history events
│   ├── history/[id]/route.ts
│   ├── categories/route.ts   # CRUD for categories
│   ├── categories/[id]/route.ts
│   ├── comments/route.ts     # Comments CRUD
│   ├── comments/[id]/route.ts
│   ├── users/route.ts        # User management
│   ├── users/[id]/route.ts
│   └── site-config/route.ts  # Site settings
├── admin/page.tsx            # Admin dashboard (fixed ContentTab + Video upload)
├── admin/login/page.tsx
├── archive/page.tsx
├── articles/page.tsx
├── audio/page.tsx
├── biography/page.tsx
├── contact/page.tsx
├── dictionary/page.tsx
├── diwan/page.tsx
├── diwan/[id]/page.tsx
├── history/page.tsx
├── majlis/page.tsx
├── proverbs/page.tsx
├── videos/page.tsx           # Supports both YouTube and uploaded videos
├── config.yaml               # Local LLM config (LM Studio). NOT application runtime config.
components/
├── ui/                       # shadcn/ui components (60+ files)
├── Header.tsx, Hero.tsx, Navigation.tsx, Footer.tsx, ...
hooks/
├── use-mobile.ts
└── use-toast.ts
lib/
├── db.ts                     # MongoDB connection (cached for Next.js hot reload)
├── models/                   # Mongoose models (Video, Poem, Article, etc.)
├── auth.ts                   # JWT sign/verify helpers
├── r2.ts                     # Cloudflare R2 S3 client + presigned URL generator
├── data-store.ts             # Client-side API client (calls /api/* endpoints)
└── utils.ts                  # `cn()` helper
middleware.ts                 # Route protection (admin + API auth)
scripts/
└── seed.ts                   # Seed MongoDB with default data
styles/
└── globals.css               # UNUSED alternate stylesheet (do not edit)
public/                       # Static assets
```

### Key Path Aliases (`tsconfig.json`)
- `@/*` maps to the project root.
- shadcn aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/lib`, `@/hooks`.

## Build & Development Commands

```bash
npm run dev       # Start the Next.js development server (default port 3000)
npm run build     # Create an optimized production build
npm run start     # Start the production server (requires `build` first)
npm run lint      # Run ESLint across the project
```

There is no `test` script and no test runner is installed.

## Code Style & Conventions

### TypeScript
- Strict mode is enabled (`strict: true`).
- Target is `ES6`, module is `esnext`, resolution is `bundler`.
- `jsx` is set to `react-jsx`.
- Build errors are **ignored** (`typescript.ignoreBuildErrors: true` in `next.config.mjs`), so type safety is enforced at development time only.

### Components
- **Server Components** are the default in the App Router. Use `'use client'` only when browser APIs or React hooks are needed.
- shadcn/ui components live in `components/ui/` and follow a consistent pattern:
  - Use `class-variance-authority` (CVA) for component variants.
  - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
  - Use `@radix-ui/react-*` primitives for accessibility and behavior.
- Page-level shared components (Header, Navigation, Footer) are imported manually into each page.

### Styling
- Tailwind CSS v4 is configured via CSS imports (`@import 'tailwindcss'`), **not** a JavaScript config file.
- The design system is built on CSS variables defined in `app/globals.css`.
- The active theme is a **dark luxury palette** (purple and gold accents) with a neutral base. Both `:root` and `.dark` are explicitly defined.
- Custom utility classes are defined in `app/globals.css`:
  - `.gold-gradient`, `.animated-gradient`
  - `.purple-glow`, `.gold-glow`
  - `.glass`, `.glass-dark`
  - `.heritage-pattern`, `.islamic-pattern`
  - `.card-lift`, `.shimmer`, `.animate-float`
- Fonts:
  - Sans-serif: `Tajawal` (loaded from Google Fonts inside CSS).
  - Serif: `Amiri` (loaded from Google Fonts inside CSS).
  - Monospace: `Geist Mono` fallback.
- The layout is **RTL** (`dir="rtl"`). When adding new UI elements, ensure margins, paddings, and flex directions respect RTL context.

### ESLint
- Configured in `eslint.config.mjs` using `eslint-config-next` presets:
  - `core-web-vitals`
  - `typescript`
- Ignores `.next/`, `out/`, `build/`, and `next-env.d.ts`.

## Testing Strategy

**No testing framework is currently configured.** There are no unit tests, integration tests, or end-to-end tests in the project.

If you add tests, ensure the chosen tools are compatible with **React 19** and **Next.js 16**, as APIs may differ from earlier versions.

## Deployment & Runtime Configuration

### Active Next.js Config (`next.config.mjs`)
```js
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

- `ignoreBuildErrors: true` means the build will succeed even if TypeScript reports errors.
- `images.unoptimized: true` disables the Next.js image optimization service. `<Image />` components will render as standard `<img>` tags. This is useful for static exports or hosts without the optimization endpoint.

### Inactive Config
- `next.config.ts` exists but is empty/default. **Do not use it.** `next.config.mjs` is the effective file.

### Deployment Target
- The project is set up for **Vercel** (evidenced by `@vercel/analytics` and the default README).
- No CI/CD configuration files (`.github/workflows`, Docker, etc.) are present.
- **Static export was removed** — the app now uses full Next.js SSR with API routes.
- Requires a running MongoDB instance and Cloudflare R2 credentials for full functionality.

## Security Considerations

- `app/config.yaml` contains a local LLM configuration (LM Studio provider, local endpoint). It is not exposed to the browser, but avoid placing production secrets in YAML files inside `app/`.
- Authentication uses **JWT in HTTP-only cookies** with bcrypt password hashing.
- API routes are protected by `middleware.ts` — admin routes redirect to login, API routes return 401 for unauthenticated requests.
- The `.env.local` file contains sensitive credentials (MongoDB URI, JWT secret, R2 keys). It is listed in `.gitignore`.
- No `.env` file is present. If environment variables are introduced later, ensure `.env` and `.env.local` are listed in `.gitignore`.
- Because images are unoptimized, any user-provided image URLs rendered with `next/image` will be served as-is.

## Important Notes for Agents

1. **Next.js 16 Breaking Changes** — This version may include APIs and conventions that differ from Next.js 14/15 training data. If you are unsure about an App Router API, consult the local docs in `node_modules/next/dist/docs/`.
2. **Tailwind CSS v4** — There is no `tailwind.config.js`. All Tailwind configuration is done inside `app/globals.css` using `@theme inline` and `@import 'tailwindcss'`.
3. **Active vs. Inactive Files** — The active global CSS is `app/globals.css`. The active Next.js config is `next.config.mjs`. The file at `styles/globals.css` is unused.
4. **Database-Backed Data** — All content (poems, articles, videos, etc.) is now stored in MongoDB and fetched via API routes. `lib/data-store.ts` is a client-side API client. `scripts/seed.ts` seeds the database with default data.
5. **Video Upload** — The admin panel supports uploading video files directly to Cloudflare R2 via presigned URLs. Uploaded videos are displayed with the HTML5 `<video>` element; YouTube videos still use `iframe` embed.
5. **RTL Context** — Always remember the site is Arabic/RTL. Avoid hardcoding left/right margins without considering RTL transforms, and ensure any new text content is Arabic or properly localized.
6. **Keep It Simple** — The project is a static content site. Do not introduce unnecessary backend complexity (API routes, databases, auth) unless explicitly requested.
