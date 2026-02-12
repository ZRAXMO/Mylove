import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGameStore } from "@/hooks/use-game-store";
import { Character } from "./3d/Character";
import { Partner } from "./3d/Partner";
import { Obstacle } from "./3d/Obstacle";
import { Environment } from "./3d/Environment";

interface ObstacleData {
  id: number;
  lane: number;
  z: number;
  type: "heart" | "emoji" | "bomb" | "brokenheart";
  collected?: boolean;
}

function GameScene() {
  const { isPlaying, isPaused, updateDistance, endGame, playerImage, partnerImage, distance, speed, incrementHearts, level } = useGameStore();
  const [lane, setLane] = useState(1);
  const [jump, setJump] = useState(false);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const lastSpawn = useRef(0);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === "ArrowLeft") setLane((prev) => Math.max(0, prev - 1));
      if (e.key === "ArrowRight") setLane((prev) => Math.min(2, prev + 1));
      if (e.key === "ArrowUp" && !jump) {
        setJump(true);
        setTimeout(() => setJump(false), 800);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, jump]);

  // Touch controls
  const touchStart = useRef(0);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPlaying) return;
      const diff = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) setLane((prev) => Math.min(2, prev + 1));
        else setLane((prev) => Math.max(0, prev - 1));
      } else if (!jump) {
        setJump(true);
        setTimeout(() => setJump(false), 800);
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPlaying, jump]);

  // Game Loop - love collection with bombs
  useFrame((state, delta) => {
    if (!isPlaying || isPaused) return;

    updateDistance(delta * 10);

    // Spawn love hearts, emojis, and bombs - MORE FREQUENTLY
    const spawnInterval = 35 / speed; // Reduced from 50 to spawn more
    if (state.clock.elapsedTime - lastSpawn.current > spawnInterval) {
      lastSpawn.current = state.clock.elapsedTime;
      
      const random = Math.random();
      let type: "heart" | "emoji" | "bomb" | "brokenheart";
      
      // 40% hearts, 20% emojis, 25% bombs, 15% broken hearts
      if (random < 0.4) {
        type = "heart";
      } else if (random < 0.6) {
        type = "emoji";
      } else if (random < 0.85) {
        type = "bomb";
      } else {
        type = "brokenheart";
      }
      
      setObstacles((prev) => [
        ...prev,
        {
          id: Math.random(),
          lane: Math.floor(Math.random() * 3),
          z: -100,
          type,
          collected: false,
        },
      ]);
    }

    // Move and check for collection/collision
    setObstacles((prev) => {
      // Speed increases with level - starts SLOWER
      const levelSpeedMultiplier = 1 + (level * 0.12); // Reduced from 0.15
      const adjustedSpeed = speed * delta * 6 * levelSpeedMultiplier; // Reduced from 8 to 6
      
      const next = prev.map((o) => ({ ...o, z: o.z + adjustedSpeed }));

      for (const o of next) {
        if (!o.collected && o.z > -1.5 && o.z < 2) {
          if (o.lane === lane) {
            // Check if it's a good item (heart/emoji) or bad item (bomb/broken heart)
            if (o.type === "heart" || o.type === "emoji") {
              // Collected a love item!
              o.collected = true;
              incrementHearts();
              updateDistance(delta * 50); // Bonus distance for love collected
            } else if (o.type === "bomb" || o.type === "brokenheart") {
              // Hit a bomb or broken heart - GAME OVER!
              endGame();
            }
          }
        }
      }

      // Remove passed or collected items
      return next.filter((o) => o.z < 20 && !o.collected);
    });
  });

  return (
    <>
      <Environment />
      <Character lane={lane} jump={jump} playerImage={playerImage} />
      <Partner distance={distance} partnerImage={partnerImage} />
      
      {obstacles.map((o) => (
        <Obstacle
          key={o.id}
          position={[(o.lane - 1) * 2.5, 0, o.z]}
          type={o.type}
        />
      ))}
    </>
  );
}

export function Game() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 4, 10], fov: 60 }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <GameScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
