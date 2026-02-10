# replit.md

## Overview

This is a browser-based endless runner game called "Distance of Love," inspired by Subway Surfers but with an emotional/romantic theme. Two characters run forward through an environment that evolves through emotional phases (Longing → Hope → Gratitude → Joy) instead of traditional game levels. The player controls Character A while Character B runs ahead. Players can upload custom PNG images for both characters. The game tracks distance traveled and phase reached, with a leaderboard backed by a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React with TypeScript, built with Vite
- **3D Rendering**: Three.js via `@react-three/fiber` and `@react-three/drei` for the game world (endless runner mechanics, characters, obstacles, environment)
- **State Management**: Zustand (`use-game-store.ts`) for performance-critical game state (distance, phase, speed, player config). Uses `persist` middleware to save character images and settings to localStorage
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, styled with Tailwind CSS and CSS variables
- **UI Animations**: Framer Motion for HUD overlays, messages, and transitions
- **Data Fetching**: TanStack React Query for server state (leaderboard scores)
- **Routing**: Wouter (lightweight router) — single page at `/` (Home)
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express.js on Node with TypeScript (runs via `tsx`)
- **Database**: PostgreSQL with Drizzle ORM
- **API**: Two REST endpoints defined in `shared/routes.ts`:
  - `GET /api/scores` — returns top 10 scores ordered by distance
  - `POST /api/scores` — creates a new score entry with Zod validation
- **Storage Layer**: `DatabaseStorage` class in `server/storage.ts` implements `IStorage` interface (can be swapped)

### Shared (shared/)
- **Schema**: Drizzle schema in `shared/schema.ts` defines a `scores` table (id, playerName, distance, phaseReached, message, createdAt)
- **Routes**: Type-safe API route definitions with Zod schemas in `shared/routes.ts`
- **Types**: `GamePhase`, `GameConfig`, `Score`, `InsertScore` shared between client and server

### Build System
- **Dev**: `tsx server/index.ts` with Vite dev server middleware (HMR via `server/vite.ts`)
- **Production**: Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: `drizzle-kit push` via `npm run db:push`

### Game Design
- **Emotional Phases**: Distance-based progression through 4 phases (longing < 1000m, hope < 2000m, gratitude < 3000m, joy thereafter)
- **Phase Visuals**: Each phase changes environment colors, lighting, speed, and displays thematic messages
- **Character Customization**: Players upload PNG images stored as data URLs in Zustand/localStorage
- **Controls**: Arrow keys / swipe for lane changes, jumping, sliding
- **3D World**: Three lanes (LANE_WIDTH = 3), obstacles, environment particles (stars, clouds, hearts based on phase)

## External Dependencies

### Database
- **PostgreSQL** via `DATABASE_URL` environment variable (required)
- **Drizzle ORM** for queries and schema management
- **connect-pg-simple** for session storage (available but not currently used for auth)

### Key NPM Packages
- `three`, `@react-three/fiber`, `@react-three/drei` — 3D game rendering
- `zustand` — Game state management with localStorage persistence
- `framer-motion` — UI animations
- `@tanstack/react-query` — Server state management
- `wouter` — Client-side routing
- `zod`, `drizzle-zod` — Runtime validation
- `shadcn/ui` ecosystem (Radix UI primitives, Tailwind CSS, class-variance-authority, clsx, tailwind-merge, lucide-react icons)

### Fonts (Google Fonts CDN)
- Cinzel (display headings)
- Montserrat (body text)
- Great Vibes (script/decorative)
- DM Sans, Fira Code, Geist Mono, Architects Daughter (loaded in HTML)

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in dev
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` — Dev-only Replit integrations