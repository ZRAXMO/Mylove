import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GamePhase } from '@shared/schema';

interface GameState {
  // Config
  playerImage: string | null;
  partnerImage: string | null;
  playerName: string;
  hasSeenIntro: boolean;
  
  // Runtime
  isPlaying: boolean;
  isGameOver: boolean;
  distance: number;
  score: number;
  phase: GamePhase;
  speed: number;
  
  // Actions
  setPlayerImage: (img: string | null) => void;
  setPartnerImage: (img: string | null) => void;
  setPlayerName: (name: string) => void;
  setHasSeenIntro: (seen: boolean) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateDistance: (delta: number) => void;
  setPhase: (phase: GamePhase) => void;
}

const PHASES: { limit: number, phase: GamePhase }[] = [
  { limit: 1000, phase: 'longing' },
  { limit: 2000, phase: 'hope' },
  { limit: 3000, phase: 'gratitude' },
  { limit: Infinity, phase: 'joy' },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial Config
      playerImage: null,
      partnerImage: null,
      playerName: "Runner",
      hasSeenIntro: false,
      
      // Initial Runtime
      isPlaying: false,
      isGameOver: false,
      distance: 0,
      score: 0,
      phase: 'longing',
      speed: 10, // Base speed
      
      setPlayerImage: (img) => set({ playerImage: img }),
      setPartnerImage: (img) => set({ partnerImage: img }),
      setPlayerName: (name) => set({ playerName: name }),
      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),
      
      startGame: () => set({ isPlaying: true, isGameOver: false, distance: 0, phase: 'longing', speed: 10 }),
      endGame: () => set({ isPlaying: false, isGameOver: true }),
      resetGame: () => set({ isPlaying: false, isGameOver: false, distance: 0, phase: 'longing', speed: 10 }),
      
      updateDistance: (delta) => {
        const { distance, phase, speed } = get();
        const newDist = distance + (delta * speed * 0.1);
        
        // Determine phase based on distance
        let newPhase = phase;
        for (const p of PHASES) {
          if (newDist < p.limit) {
            newPhase = p.phase;
            break;
          }
        }
        
        // Increase speed slightly over time
        const newSpeed = Math.min(25, 10 + (newDist / 500));
        
        set({ distance: newDist, phase: newPhase, speed: newSpeed });
      },
      
      setPhase: (phase) => set({ phase }),
    }),
    {
      name: 'love-run-storage',
      partialize: (state) => ({ 
        playerImage: state.playerImage, 
        partnerImage: state.partnerImage,
        playerName: state.playerName,
        hasSeenIntro: state.hasSeenIntro
      }),
    }
  )
);
