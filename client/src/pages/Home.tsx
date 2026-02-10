import { useState, useRef } from "react";
import { useGameStore } from "@/hooks/use-game-store";
import { GameWorld } from "@/components/GameWorld";
import { GameHUD } from "@/components/GameHUD";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useScores, useCreateScore } from "@/hooks/use-scores";
import { Upload, Heart, Play, Trophy, RotateCcw } from "lucide-react";

export default function Home() {
  const { 
    isPlaying, 
    isGameOver, 
    distance, 
    startGame, 
    resetGame, 
    playerName, 
    setPlayerName,
    setPlayerImage,
    setPartnerImage,
    playerImage,
    partnerImage
  } = useGameStore();

  const { data: scores } = useScores();
  const createScore = useCreateScore();
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // File Upload Helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitScore = async () => {
    if (scoreSubmitted) return;
    try {
      await createScore.mutateAsync({
        playerName,
        distance: Math.floor(distance),
        phaseReached: useGameStore.getState().phase,
        message: "Ran for love",
      });
      setScoreSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 3D World in Background */}
      <GameWorld />
      
      {/* Heads Up Display */}
      <GameHUD />

      {/* Menus Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        
        {/* START SCREEN */}
        {!isPlaying && !isGameOver && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto max-w-md w-full p-6"
          >
            <Card className="glass-panel border-none text-white p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Love Run
                </h1>
                <p className="text-white/60 font-script text-2xl">
                  How far will you go for love?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input 
                    value={playerName} 
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                    placeholder="Enter name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>You</Label>
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors bg-black/20 overflow-hidden flex items-center justify-center group cursor-pointer">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(e, setPlayerImage)}
                      />
                      {playerImage ? (
                        <img src={playerImage} className="w-full h-full object-cover" alt="Player" />
                      ) : (
                        <Upload className="w-8 h-8 text-white/30 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Partner</Label>
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors bg-black/20 overflow-hidden flex items-center justify-center group cursor-pointer">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(e, setPartnerImage)}
                      />
                      {partnerImage ? (
                        <img src={partnerImage} className="w-full h-full object-cover" alt="Partner" />
                      ) : (
                        <Heart className="w-8 h-8 text-white/30 group-hover:text-rose-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={startGame}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/20"
                >
                  <Play className="mr-2 w-5 h-5 fill-current" /> Start Running
                </Button>
              </div>

              {/* Leaderboard Preview */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/50 mb-3">
                  <Trophy className="w-4 h-4" /> Recent Runners
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {scores?.slice(0, 3).map((s) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-white/80">{s.playerName}</span>
                      <span className="text-primary font-mono">{s.distance}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* GAME OVER SCREEN */}
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto max-w-md w-full p-6 text-center"
          >
            <Card className="glass-panel border-none p-8 space-y-6">
              <h2 className="text-4xl font-display font-bold text-white">
                Love Never Ends
              </h2>
              <div className="py-4">
                <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-400 to-purple-400 mb-2">
                  {Math.floor(distance)}m
                </div>
                <p className="text-white/60">Distance of Love</p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleSubmitScore}
                  disabled={scoreSubmitted || createScore.isPending}
                  variant="outline"
                  className="w-full border-white/20 hover:bg-white/10 text-white"
                >
                  {scoreSubmitted ? "Score Saved!" : "Save My Distance"}
                </Button>
                
                <Button 
                  onClick={() => { setScoreSubmitted(false); resetGame(); }}
                  className="w-full bg-white text-black hover:bg-white/90 font-bold"
                >
                  <RotateCcw className="mr-2 w-4 h-4" /> Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
