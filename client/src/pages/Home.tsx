import { useState } from "react";
import { useGameStore } from "@/hooks/use-game-store";
import { Game } from "@/components/Game";
import { GameHUD } from "@/components/GameHUD";
import { RomanticMessages } from "@/components/RomanticMessages";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Heart, Play, Trophy, RotateCcw, Sparkles } from "lucide-react";

export default function Home() {
  const { 
    isPlaying, 
    isGameOver, 
    distance, 
    level,
    startGame, 
    resetGame, 
    playerName, 
    setPlayerName,
    setPlayerImage,
    setPartnerImage,
    playerImage,
    partnerImage
  } = useGameStore();

  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  
  // Local storage for scores
  const saveScore = () => {
    if (scoreSubmitted) return;
    const scores = JSON.parse(localStorage.getItem('loveRunScores') || '[]');
    scores.push({
      playerName,
      distance: Math.floor(distance),
      level,
      date: new Date().toISOString()
    });
    scores.sort((a: any, b: any) => b.distance - a.distance);
    localStorage.setItem('loveRunScores', JSON.stringify(scores.slice(0, 10)));
    setScoreSubmitted(true);
  };

  const getTopScores = () => {
    return JSON.parse(localStorage.getItem('loveRunScores') || '[]').slice(0, 3);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* 3D Game World */}
      <Game />
      
      {/* Heads Up Display */}
      <GameHUD />

      {/* Romantic Messages - Show during gameplay */}
      {isPlaying && <RomanticMessages />}

      {/* Made For Dedication - Only show when NOT playing */}
      {!isPlaying && (
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-6 left-6 z-40 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border-2 border-white/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="font-bold text-md">Made for Tannu with lots of love 💕</span>
          </div>
        </motion.div>
      )}

      {/* Made By Credit - Only show when NOT playing */}
      {!isPlaying && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-40 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-pink-600 to-pink-300 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-white/30">
            <Heart className="w-4 h-4 fill-white animate-pulse" />
            <span className="font-semibold">Made by Abhishek ❤️</span>
          </div>
        </motion.div>
      )}

      {/* Menus Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        
        {/* START SCREEN */}
        {!isPlaying && !isGameOver && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto max-w-md w-full p-6"
          >
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-rose-200 shadow-2xl p-8 space-y-6">
              <div className="text-center space-y-2">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                    Love Run
                  </h1>
                </motion.div>
                <p className="text-gray-600 font-script text-2xl">
                  How far will you go for love?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Your Name</Label>
                  <Input 
                    value={playerName} 
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-white border-2 border-rose-200 text-gray-800 placeholder:text-gray-400 focus:border-rose-400 focus:ring-rose-400"
                    placeholder="Abhishek/Tannu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">You</Label>
                    <div className="relative">
                      <label className="relative aspect-square rounded-2xl border-3 border-dashed border-rose-300 hover:border-rose-500 transition-all bg-gradient-to-br from-rose-50 to-pink-50 overflow-hidden flex items-center justify-center group cursor-pointer shadow-md hover:shadow-xl block">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                          onChange={(e) => handleImageUpload(e, setPlayerImage)}
                        />
                        {playerImage ? (
                          <img src={playerImage} className="w-full h-full object-cover" alt="Player" />
                        ) : (
                          <div className="text-center pointer-events-none">
                            <Upload className="w-10 h-10 text-rose-400 group-hover:text-rose-600 transition-colors mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Upload Photo</p>
                          </div>
                        )}
                      </label>
                      {playerImage && (
                        <button
                          onClick={() => setPlayerImage(null)}
                          className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110"
                          type="button"
                          aria-label="Remove player photo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Partner</Label>
                    <div className="relative">
                      <label className="relative aspect-square rounded-2xl border-3 border-dashed border-pink-300 hover:border-pink-500 transition-all bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden flex items-center justify-center group cursor-pointer shadow-md hover:shadow-xl block">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                          onChange={(e) => handleImageUpload(e, setPartnerImage)}
                        />
                        {partnerImage ? (
                          <img src={partnerImage} className="w-full h-full object-cover" alt="Partner" />
                        ) : (
                          <div className="text-center pointer-events-none">
                            <Heart className="w-10 h-10 text-pink-400 group-hover:text-pink-600 transition-colors mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Upload Photo</p>
                          </div>
                        )}
                      </label>
                      {partnerImage && (
                        <button
                          onClick={() => setPartnerImage(null)}
                          className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110"
                          type="button"
                          aria-label="Remove partner photo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={startGame}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all"
                >
                  <Play className="mr-2 w-5 h-5 fill-current" /> Start Running
                </Button>
              </div>

              {/* Leaderboard Preview */}
              <div className="pt-4 border-t-2 border-rose-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-semibold">
                  <Trophy className="w-5 h-5 text-amber-500" /> Recent Runners
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {getTopScores().map((s: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-gradient-to-r from-rose-50 to-transparent p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-500">#{idx + 1}</span>
                        <span className="text-gray-700 font-medium">{s.playerName}</span>
                      </div>
                      <span className="text-rose-600 font-bold font-mono">{s.distance}m</span>
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
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-rose-200 shadow-2xl p-8 space-y-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                  Love Collected!
                </h2>
              </motion.div>
              
              <div className="py-4 space-y-3">
                <div className="text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-pink-600 mb-2">
                  {Math.floor(distance)}m
                </div>
                <p className="text-gray-600 font-semibold">Distance Traveled ❤️</p>
                
                <div className="flex items-center justify-center gap-2 my-3">
                  <span className="text-4xl">❤️</span>
                  <span className="text-3xl font-bold text-rose-500">{useGameStore.getState().heartsCollected}</span>
                  <span className="text-gray-600 font-semibold">Hearts Collected</span>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-2 rounded-full">
                    <span className="text-gray-700 font-semibold">Level: {level}</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
                    <span className="text-gray-700 font-semibold">Phase: {useGameStore.getState().phase}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={saveScore}
                  disabled={scoreSubmitted}
                  variant="outline"
                  className="w-full border-2 border-rose-300 hover:bg-rose-50 text-gray-800 hover:text-rose-700 font-semibold"
                >
                  {scoreSubmitted ? "❤️ Score Saved!" : "Save My Distance"}
                </Button>
                
                <Button 
                  onClick={() => { setScoreSubmitted(false); resetGame(); }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-lg"
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
