# Supabase Integration Guide

## Changes Made

### Server Simplification
The backend has been simplified to only serve the frontend application. All backend logic has been removed in preparation for Supabase integration.

#### Fixed Issues
- ✅ **ENOTSUP Error**: Changed server to listen on `127.0.0.1` instead of `0.0.0.0` (Windows compatibility)
- ✅ **Removed Backend Routes**: Deleted `server/routes.ts` and simplified `server/index.ts`
- ✅ **Cleaned Up Shared Code**: Simplified `shared/routes.ts` to only export types

### Current Storage
Currently, the game uses **localStorage** for storing scores locally in the browser. This will be replaced with Supabase for persistent, cloud-based storage.

## Supabase Integration Steps

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 3. Create Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Schema

Create a `scores` table in Supabase with the following SQL:

```sql
-- Create scores table
create table scores (
  id bigint generated always as identity primary key,
  player_name text not null,
  distance integer not null,
  phase_reached text not null,
  message text,
  created_at timestamp with time zone default now()
);

-- Add index for faster queries
create index scores_distance_idx on scores(distance desc);

-- Enable Row Level Security (RLS)
alter table scores enable row level security;

-- Allow anyone to read scores (public leaderboard)
create policy "Scores are viewable by everyone"
  on scores for select
  using (true);

-- Allow anyone to insert their own score
create policy "Anyone can insert scores"
  on scores for insert
  with check (true);
```

### 5. Create Supabase Client

Create `client/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Score {
  id: number;
  player_name: string;
  distance: number;
  phase_reached: string;
  message?: string | null;
  created_at: string;
}
```

### 6. Update the Scores Hook

Update `client/src/hooks/use-scores.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type InsertScore } from "@shared/routes";

// Transform Supabase score to app Score type
function transformScore(dbScore: any): Score {
  return {
    id: dbScore.id,
    playerName: dbScore.player_name,
    distance: dbScore.distance,
    phaseReached: dbScore.phase_reached,
    message: dbScore.message,
    createdAt: dbScore.created_at,
  };
}

export function useScores() {
  return useQuery({
    queryKey: ["scores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("distance", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data?.map(transformScore) || [];
    },
  });
}

export function useCreateScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (score: InsertScore) => {
      const { data, error } = await supabase
        .from("scores")
        .insert({
          player_name: score.playerName,
          distance: score.distance,
          phase_reached: score.phaseReached,
          message: score.message,
        })
        .select()
        .single();

      if (error) throw error;
      return transformScore(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
  });
}
```

### 7. Update TypeScript Types

The types in `shared/schema.ts` are already compatible with Supabase. Just ensure the field names match:

```typescript
export interface Score {
  id: number;
  playerName: string;      // maps to player_name
  distance: number;
  phaseReached: string;    // maps to phase_reached
  message?: string | null;
  createdAt: Date | string; // maps to created_at
}
```

## Environment Variables Setup

### Development (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Vite Config
The `VITE_` prefix ensures these variables are exposed to the client. They're accessed via:
```typescript
import.meta.env.VITE_SUPABASE_URL
```

## Features Enabled by Supabase

### Current (localStorage)
- ✅ Local score storage
- ❌ Shared across devices
- ❌ Global leaderboard
- ❌ Real-time updates

### With Supabase
- ✅ Cloud-based storage
- ✅ Shared across devices
- ✅ Global leaderboard
- ✅ Real-time updates (optional)
- ✅ Backup and recovery
- ✅ Analytics possibilities

## Optional: Real-time Leaderboard

To add real-time score updates:

```typescript
// In use-scores.ts
import { useEffect } from 'react';

export function useScores() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["scores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("distance", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data?.map(transformScore) || [];
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('scores-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scores'
        },
        () => {
          // Refresh scores when new one is added
          queryClient.invalidateQueries({ queryKey: ["scores"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}
```

## Authentication (Optional)

If you want to add user authentication later:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

Then update the RLS policies to restrict score insertion to authenticated users.

## Additional Features to Consider

### 1. Player Profiles
Store player info, avatars, and stats in a separate `profiles` table.

### 2. Achievements
Track achievements and badges in an `achievements` table.

### 3. Game Sessions
Log complete game sessions for analytics in a `sessions` table.

### 4. Social Features
- Friend system
- Challenge friends
- Share scores on social media

### 5. Analytics
Use Supabase to track:
- Most common game-over points
- Average distances by phase
- Popular character customizations

## Testing

After integration, test:

1. ✅ Scores are saved to Supabase
2. ✅ Leaderboard loads from Supabase
3. ✅ Scores persist across sessions
4. ✅ Multiple users can see same leaderboard
5. ✅ Error handling works (network failures, etc.)

## Troubleshooting

### CORS Errors
Ensure your Supabase project allows your local development URL:
- Dashboard → Settings → API → CORS

### Connection Errors
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are set correctly

### Missing Scores
- Check browser console for errors
- Verify table schema matches exactly
- Test queries in Supabase SQL editor

---

**Note**: Keep your Supabase keys secure. The anon key is safe for client-side use, but never commit the service role key to version control.
