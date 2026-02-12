# Distance of Love - Game Project Documentation

## 📋 Project Overview

**Distance of Love** is a browser-based 3D endless runner game inspired by Subway Surfers but with a unique emotional/romantic theme. The game features two characters running through an environment that evolves through emotional phases (Longing → Hope → Gratitude → Joy) as the player progresses.

### Key Features
- **3D Graphics**: Built with Three.js and React Three Fiber
- **Emotional Progression**: Four distinct phases that change the visual environment
- **Character Customization**: Upload custom PNG images for both characters
- **Local Leaderboard**: Top 10 scores stored in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **3D Engine**: Three.js via @react-three/fiber and @react-three/drei
- **State Management**: Zustand with localStorage persistence
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3 with custom CSS variables
- **Animations**: Framer Motion
- **Data Fetching**: TanStack React Query
- **Routing**: Wouter (lightweight router)

#### Backend
- **Framework**: Express.js 5 with TypeScript (simplified)
- **Purpose**: Static file serving and Vite dev server in development
- **Server Runtime**: Node.js with tsx (TypeScript execution)
- **Note**: Backend logic removed - ready for Supabase integration

#### Data Storage
- **Current**: Browser localStorage (temporary)
- **Planned**: Supabase (cloud database)
- **Migration Guide**: See [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md)

## 📁 Project Structure

```
Web-Game-Dev/
├── client/                      # Frontend application
│   ├── index.html              # HTML entry point
│   ├── requirements.md         # Feature requirements
│   ├── public/                 # Static assets
│   └── src/
│       ├── App.tsx            # Root component
│       ├── main.tsx           # Entry point
│       ├── index.css          # Global styles
│       ├── components/
│       │   ├── GameHUD.tsx    # Game overlay UI
│       │   ├── GameWorld.tsx  # 3D game canvas
│       │   └── ui/            # shadcn/ui components (40+ components)
│       ├── hooks/
│       │   ├── use-game-store.ts    # Zustand game state
│       │   ├── use-scores.ts        # localStorage score management
│       │   ├── use-mobile.tsx       # Mobile detection hook
│       │   └── use-toast.ts         # Toast notifications
│       ├── lib/
│       │   ├── queryClient.ts       # React Query config
│       │   └── utils.ts             # Utility functions
│       └── pages/
│           ├── Home.tsx             # Home page
│           └── not-found.tsx        # 404 page
│
├── server/                     # Backend application
│   ├── index.ts               # Express server entry
│   ├── routes.ts              # API routes (minimal)
│   ├── static.ts              # Static file serving
│   └── vite.ts                # Vite dev server integration
│
├── shared/                     # Shared code between client/server
│   ├── routes.ts              # API route definitions
│   └── schema.ts              # TypeScript types & Zod schemas
│
├── script/
│   └── build.ts               # Production build script
│
├── attached_assets/           # Project assets
├── components.json            # shadcn/ui config
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── tailwind.config.ts         # Tailwind CSS config
└── postcss.config.js          # PostCSS config
```

## 🎮 Game Design

### Emotional Phases

The game progresses through 4 emotional phases based on distance traveled:

| Phase | Distance Range | Theme | Visual Changes |
|-------|---------------|-------|----------------|
| **Longing** | 0 - 999m | Yearning and anticipation | Cool colors, slower speed |
| **Hope** | 1000 - 1999m | Optimism emerging | Brighter tones, increased speed |
| **Gratitude** | 2000 - 2999m | Appreciation | Warm colors, faster pace |
| **Joy** | 3000m+ | Pure happiness | Vibrant colors, maximum speed |

### Game Mechanics

- **Three-Lane System**: Players can move left, right, or stay in center
- **Controls**: 
  - Desktop: Arrow keys (←/→ for lanes, ↑ for jump, ↓ for slide)
  - Mobile: Swipe gestures
- **Obstacles**: Dynamic obstacles spawn based on current phase
- **Speed Progression**: Game speed increases with distance
- **Character Separation**: Character B runs ahead as a goal

### State Management

#### Game Store (Zustand)
Located in `client/src/hooks/use-game-store.ts`:
- **Game State**: distance, phase, speed, score, isPlaying, isPaused
- **Player Config**: playerImage, partnerImage, customMessages
- **Persistence**: Images and settings saved to localStorage
- **Actions**: startGame, pauseGame, updateDistance, updatePhase, etc.

#### Score Storage (localStorage)
Located in `client/src/hooks/use-scores.ts`:
- Stores top 10 scores
- Auto-sorts by distance (highest first)
- Includes: id, playerName, distance, phaseReached, message, createdAt

## 🎨 UI Components

### Core Game Components

**GameWorld** (`client/src/components/GameWorld.tsx`)
- Three.js canvas and scene setup
- Player character controls
- Obstacle spawning and collision detection
- Environment rendering (ground, sky, particles)
- Phase transitions

**GameHUD** (`client/src/components/GameHUD.tsx`)
- Distance counter
- Current phase indicator
- Pause/resume controls
- Game over modal
- Leaderboard display

### UI Library

The project uses 40+ shadcn/ui components including:
- Forms: button, input, textarea, checkbox, radio-group, select, switch
- Overlays: dialog, alert-dialog, sheet, drawer, popover, tooltip
- Navigation: tabs, accordion, breadcrumb, menubar, navigation-menu
- Data Display: table, card, badge, avatar, separator
- Feedback: toast, alert, progress, skeleton
- Layout: scroll-area, resizable, sidebar

## 🚀 Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Scripts

```bash
# Development server (with HMR)
npm run dev

# Type checking
npm run check

# Production build
npm run build

# Start production server
npm run start
```

### Development Server
- Frontend: Hot Module Replacement via Vite
- Backend: Auto-restart on file changes via tsx
- Port: Configurable via environment variables

### Path Aliases
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## 📦 Dependencies

### Core Runtime
- **react** & **react-dom** (^18.3.1) - UI framework
- **three** (^0.160.1) - 3D engine
- **@react-three/fiber** (^8.18.0) - React Three.js renderer
- **@react-three/drei** (^9.122.0) - Three.js helpers
- **zustand** (^5.0.11) - State management
- **wouter** (^3.3.5) - Routing
- **express** (^5.0.1) - Server framework

### UI & Styling
- **tailwindcss** (^3.4.17) - Utility CSS
- **@tailwindcss/typography** & **@tailwindcss/vite** - Tailwind plugins
- **framer-motion** (^11.18.2) - Animations
- **lucide-react** (^0.453.0) - Icons
- **@radix-ui/react-*** - 20+ UI primitives
- **class-variance-authority** (^0.7.1) - Component variants
- **tailwind-merge** (^2.6.0) - Class merging

### Data & Validation
- **@tanstack/react-query** (^5.60.5) - Server state
- **zod** (^3.24.2) - Schema validation
- **react-hook-form** (^7.55.0) - Form handling
- **@hookform/resolvers** (^3.10.0) - Form validation

### Development Tools
- **vite** (^7.3.0) - Build tool
- **typescript** (5.6.3) - Type safety
- **tsx** (^4.20.5) - TypeScript execution
- **esbuild** (^0.25.0) - Server bundler
- **@vitejs/plugin-react** (^4.7.0) - React plugin

### Removed Dependencies
The following were removed in the database cleanup:
- ~~drizzle-orm~~ - Removed (using localStorage)
- ~~drizzle-zod~~ - Removed (using plain Zod)
- ~~drizzle-kit~~ - Removed (no migrations needed)
- ~~pg~~ - Removed (no PostgreSQL)
- ~~connect-pg-simple~~ - Removed (no sessions)
- ~~@replit/vite-plugin-*~~ - Removed (not needed)

## 🎯 Features

### Implemented
- ✅ 3D endless runner gameplay
- ✅ Four emotional phases with visual transitions
- ✅ Character customization (image upload)
- ✅ Local score persistence
- ✅ Responsive design
- ✅ Keyboard and touch controls
- ✅ Leaderboard system
- ✅ Pause/resume functionality
- ✅ Game over screen

### Potential Enhancements
- 🔲 Power-ups and collectibles
- 🔲 Sound effects and background music
- 🔲 Social sharing
- 🔲 Achievement system
- 🔲 Multiple difficulty levels
- 🔲 Daily challenges

## 🔧 Configuration Files

### TypeScript Config (`tsconfig.json`)
- Target: ES2022
- Module: ESNext
- JSX: React JSX
- Strict mode enabled
- Path aliases configured

### Vite Config (`vite.config.ts`)
- React plugin
- Path aliases
- Dev server settings
- Build output: `dist/public/`

### Tailwind Config (`tailwind.config.ts`)
- Content paths
- Custom theme colors
- Animation utilities
- Typography plugin

## 📝 Code Style

- **TypeScript**: Strict mode, explicit types preferred
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Imports**: Absolute imports using @ aliases
- **Styling**: Tailwind utility classes, CSS variables for themes


## 📄 License

MIT License

---

**Last Updated**: February 10, 2026
**Project Version**: 1.0.0
