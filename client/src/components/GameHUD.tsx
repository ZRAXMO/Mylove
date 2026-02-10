import { useGameStore } from "@/hooks/use-game-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = {
  longing: ["I miss you...", "The silence is loud...", "Where are you?", "Just one more step..."],
  hope: ["The sun is rising...", "I can feel you near...", "Almost there...", "Love finds a way."],
  gratitude: ["Thank you for waiting...", "My heart beats for you...", "You are my home.", "Forever yours."],
  joy: ["Together at last!", "Nothing can stop us!", "Our story is forever!", "Infinite love!"],
};

export function GameHUD() {
  const { distance, phase, isPlaying, isGameOver } = useGameStore();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!isPlaying) return;
    
    // Random message every 5-10 seconds
    const interval = setInterval(() => {
      const phaseMessages = MESSAGES[phase];
      const randomMsg = phaseMessages[Math.floor(Math.random() * phaseMessages.length)];
      setMessage(randomMsg);
      
      // Clear message after 3s
      setTimeout(() => setMessage(""), 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, [phase, isPlaying]);

  if (!isPlaying && !isGameOver) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h2 className="text-2xl font-display font-bold text-white/90 drop-shadow-md">
            Distance of Love
          </h2>
          <span className="text-4xl font-mono font-bold text-primary drop-shadow-lg tabular-nums">
            {Math.floor(distance)}m
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-sm uppercase tracking-widest text-white/70">Current Phase</span>
          <span className="text-xl font-display font-bold capitalize text-white drop-shadow-md">
            {phase}
          </span>
        </div>
      </div>

      {/* Center Message Area */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-6xl font-script text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {message}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls Hint (Mobile) */}
      <div className="text-center opacity-50 text-white/60 text-sm md:hidden pb-8">
        Swipe to Move • Tap to Jump
      </div>
    </div>
  );
}
