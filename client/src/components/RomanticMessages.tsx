import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";

const ROMANTIC_MESSAGES = [
  "Collecting love for you 💕",
  "Every heart brings us closer ❤️",
  "Gathering love tokens 💖",
  "Love is in the air 💗",
  "Building our love story 💝",
  "Each heart means I love you 💓",
  "Running towards your heart 💞",
  "Love conquers all 💘",
  "My heart races for you 💕",
  "Forever collecting your love ❤️",
];

export function RomanticMessages() {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % ROMANTIC_MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-32 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.85, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500/70 to-pink-500/70 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md border border-white/20">
          <Heart className="w-3 h-3 text-white fill-white" />
          <span className="text-white font-medium text-xs">
            {ROMANTIC_MESSAGES[currentMessage]}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
