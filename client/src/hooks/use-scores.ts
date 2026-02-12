import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type InsertScore, type Score } from "@shared/routes";

const STORAGE_KEY = "game-scores";

// Helper functions for localStorage
function getScoresFromStorage(): Score[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const scores = JSON.parse(stored);
    return scores.sort((a: Score, b: Score) => b.distance - a.distance).slice(0, 10);
  } catch (error) {
    console.error("Failed to load scores:", error);
    return [];
  }
}

function saveScoreToStorage(newScore: InsertScore): Score {
  const scores = getScoresFromStorage();
  const score: Score = {
    id: Date.now(),
    ...newScore,
    createdAt: new Date().toISOString(),
  };
  
  scores.push(score);
  scores.sort((a, b) => b.distance - a.distance);
  
  // Keep only top 10 scores
  const topScores = scores.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topScores));
  
  return score;
}

export function useScores() {
  return useQuery({
    queryKey: ["scores"],
    queryFn: async () => {
      // Simulate a small delay to make it feel like a real API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return getScoresFromStorage();
    },
  });
}

export function useCreateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScore) => {
      // Simulate a small delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return saveScoreToStorage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores"] });
    },
  });
}
