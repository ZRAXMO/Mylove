import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll keep a simple scores table even if the user wanted local storage primarily,
// just in case they want to save their "Distance of Love" later.
export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  distance: integer("distance").notNull(),
  phaseReached: text("phase_reached").notNull(),
  message: text("message"), // Optional custom message they might have entered
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScoreSchema = createInsertSchema(scores).omit({ id: true, createdAt: true });

export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;

// Types for the Game State (Shared between front/back if needed, but mostly frontend)
export type GamePhase = 'longing' | 'hope' | 'gratitude' | 'joy';

export interface GameConfig {
  playerImage: string | null; // Data URL or path
  partnerImage: string | null; // Data URL or path
  customMessages: string[];
}
