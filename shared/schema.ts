import { z } from "zod";

// Score type for local storage
export interface Score {
  id: number;
  playerName: string;
  distance: number;
  phaseReached: string;
  message?: string | null;
  createdAt: Date | string;
}

export const insertScoreSchema = z.object({
  playerName: z.string().min(1),
  distance: z.number().int().positive(),
  phaseReached: z.string(),
  message: z.string().optional(),
});

export type InsertScore = z.infer<typeof insertScoreSchema>;

// Types for the Game State (Shared between front/back if needed, but mostly frontend)
export type GamePhase = 'longing' | 'hope' | 'gratitude' | 'joy';

export interface GameConfig {
  playerImage: string | null; // Data URL or path
  partnerImage: string | null; // Data URL or path
  customMessages: string[];
}
