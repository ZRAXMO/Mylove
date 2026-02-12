import { useGameStore } from "@/hooks/use-game-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Home, Pause, Play } from "lucide-react";

const MESSAGES = {
  longing: ["I miss you...", "The silence is loud...", "Where are you?", "Just one more step..."],
  hope: ["The sun is rising...", "I can feel you near...", "Almost there...", "Love finds a way."],
  gratitude: ["Thank you for waiting...", "My heart beats for you...", "You are my home.", "Forever yours."],
  joy: ["Together at last!", "Nothing can stop us!", "Our story is forever!", "Infinite love!"],
};

export function GameHUD() {
  const { distance, phase, level, isPlaying, isGameOver, isPaused, resetGame, togglePause, heartsCollected, playerName } = useGameStore();
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

  const handleBackToHome = () => {
    resetGame();
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          {/* Player Name & Hearts */}
          <div className="bg-gradient-to-r from-rose-500/90 to-pink-500/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/30 flex items-center gap-3">
            <span className="text-white font-bold">{playerName || "You"}</span>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-2xl">❤️</span>
              <span className="text-xl font-bold text-white">{heartsCollected}</span>
            </div>
          </div>
          
          {/* Distance */}
          <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/30">
            <span className="text-2xl font-mono font-bold text-white drop-shadow-lg tabular-nums">
              {Math.floor(distance)}m
            </span>
          </div>
          
          {/* Back to Home Button */}
          <button
            onClick={handleBackToHome}
            className="bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-xl shadow-lg font-semibold flex items-center gap-2 transition-all hover:scale-105 border-2 border-gray-200 pointer-events-auto"
            aria-label="Back to home"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>
          
          {/* Pause/Resume Button */}
          <button
            onClick={togglePause}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg font-semibold flex items-center gap-2 transition-all hover:scale-105 border-2 border-white/30 pointer-events-auto"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-sm">{isPaused ? "Resume" : "Pause"}</span>
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-white/30">
            <span className="text-xs text-white/80 block text-center">Level</span>
            <span className="text-xl font-bold text-white block text-center">
              {level}
            </span>
          </div>
          <div className="bg-gradient-to-r from-pink-500/90 to-rose-500/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-white/30">
            <span className="text-xs text-white/80 block text-center">Phase</span>
            <span className="text-sm font-bold capitalize text-white block text-center">
              {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Center Message Area - Only show occasionally */}
      <div className="flex-1 flex items-center justify-center">
        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-4 border-rose-300"
              >
                <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent mb-4">
                  Game Paused
                </h2>
                <p className="text-gray-600 text-center mb-6">Take a breath... 💕</p>
                <button
                  onClick={togglePause}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  Resume Game
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-rose-500/70 to-pink-500/70 backdrop-blur-sm px-6 py-2 rounded-2xl border border-white/20 shadow-lg"
            >
              <h3 className="text-lg font-script text-white drop-shadow-md">
                {message}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls Hint */}
      <div className="text-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 mx-auto text-white/80 text-xs md:hidden">
        Swipe to Move • Tap to Jump
      </div>
    </div>
  );
}
