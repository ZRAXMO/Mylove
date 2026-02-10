import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, useTexture, Float, Stars, Cloud } from "@react-three/drei";
import { useGameStore } from "@/hooks/use-game-store";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

// --- Constants ---
const LANE_WIDTH = 3;
const SPEED_SCALE = 0.5;

// --- Assets ---
// Using colored boxes for now to ensure reliability without external assets
// In production, these would be models loaded via useGLTF

function Player({ lane, jump }: { lane: number, jump: boolean }) {
  const { playerImage } = useGameStore();
  const texture = useTexture(playerImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop");
  
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!mesh.current) return;
    // Smooth lane changing
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, (lane - 1) * LANE_WIDTH, delta * 10);
    
    // Jump animation
    if (jump) {
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, 2.5, delta * 15);
    } else {
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, 1, delta * 15);
    }
  });

  return (
    <mesh ref={mesh} position={[0, 1, 0]} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial map={texture} color={playerImage ? "white" : "hotpink"} />
    </mesh>
  );
}

function Partner({ distance }: { distance: number }) {
  const { partnerImage } = useGameStore();
  const texture = useTexture(partnerImage || "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=150&h=150&fit=crop");
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      // Bobbing motion
      mesh.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 1, -20]}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial map={texture} color={partnerImage ? "white" : "cyan"} opacity={0.8} transparent />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Wait for me!
        </Text>
      </Float>
    </mesh>
  );
}

function Ground({ phase }: { phase: string }) {
  const texture = useTexture("https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&fit=crop"); // Stone texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 100);

  const color = useMemo(() => {
    switch (phase) {
      case 'longing': return '#1a1a2e';
      case 'hope': return '#4a3b32';
      case 'gratitude': return '#2d4a22';
      case 'joy': return '#4a1a2e';
      default: return '#1a1a2e';
    }
  }, [phase]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -50]} receiveShadow>
      <planeGeometry args={[20, 200]} />
      <meshStandardMaterial map={texture} color={color} />
    </mesh>
  );
}

function Obstacle({ position, type }: { position: [number, number, number], type: 'barrier' | 'train' }) {
  return (
    <group position={position}>
      {type === 'barrier' ? (
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 1, 0.5]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ) : (
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2, 3, 4]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      )}
    </group>
  );
}

function EnvironmentalEffects({ phase }: { phase: string }) {
  return (
    <>
      {phase === 'longing' && (
        <>
          <fog attach="fog" args={['#111827', 5, 40]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[0, 10, 5]} intensity={0.5} color="#60a5fa" castShadow />
          <Cloud position={[-10, 5, -20]} opacity={0.5} />
          <Cloud position={[10, 5, -30]} opacity={0.5} />
        </>
      )}
      
      {phase === 'hope' && (
        <>
          <fog attach="fog" args={['#fed7aa', 10, 60]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 5, 5]} intensity={1.5} color="#fdba74" castShadow />
        </>
      )}

      {phase === 'gratitude' && (
        <>
          <fog attach="fog" args={['#dbeafe', 20, 80]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[-5, 10, -5]} intensity={1.2} color="#ffffff" castShadow />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </>
      )}

      {phase === 'joy' && (
        <>
          <fog attach="fog" args={['#fbcfe8', 15, 70]} />
          <ambientLight intensity={1} />
          <directionalLight position={[0, 10, 0]} intensity={1.5} color="#f472b6" castShadow />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={1} fade speed={2} />
        </>
      )}
    </>
  );
}

function GameScene() {
  const { isPlaying, endGame, updateDistance, speed, phase } = useGameStore();
  const [lane, setLane] = useState(1); // 0=left, 1=center, 2=right
  const [jump, setJump] = useState(false);
  
  // Track obstacles
  const [obstacles, setObstacles] = useState<{ id: number, lane: number, z: number, type: 'barrier' | 'train' }[]>([]);
  const lastSpawn = useRef(0);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') setLane(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setLane(prev => Math.min(2, prev + 1));
      if (e.key === 'ArrowUp' && !jump) {
        setJump(true);
        setTimeout(() => setJump(false), 800);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, jump]);

  // Touch Swipe Handling (Simple)
  const touchStart = useRef(0);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPlaying) return;
      const diff = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) setLane(prev => Math.min(2, prev + 1));
        else setLane(prev => Math.max(0, prev - 1));
      } else {
        // Tap to jump
        if (!jump) {
            setJump(true);
            setTimeout(() => setJump(false), 800);
        }
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    }
  }, [isPlaying, jump]);

  // Game Loop
  useFrame((state, delta) => {
    if (!isPlaying) return;

    // Move forward (simulate by moving obstacles towards player)
    updateDistance(delta * 10);
    
    // Spawn Obstacles
    if (state.clock.elapsedTime - lastSpawn.current > (30 / speed)) {
      lastSpawn.current = state.clock.elapsedTime;
      setObstacles(prev => [
        ...prev,
        {
          id: Math.random(),
          lane: Math.floor(Math.random() * 3),
          z: -100,
          type: Math.random() > 0.7 ? 'train' : 'barrier'
        }
      ]);
    }

    // Move and Clean Obstacles
    setObstacles(prev => {
        const next = prev.map(o => ({ ...o, z: o.z + (speed * delta) }));
        
        // Collision Detection
        for (const o of next) {
            // Player is at z=0. Check proximity.
            if (o.z > -1 && o.z < 1) {
                if (o.lane === lane) {
                    // Simple collision logic: if not jumping over barrier, crash
                    if (o.type === 'train' || (o.type === 'barrier' && !jump)) {
                        endGame();
                    }
                }
            }
        }
        
        return next.filter(o => o.z < 10); // Remove passed obstacles
    });
  });

  return (
    <>
      <EnvironmentalEffects phase={phase} />
      
      <Player lane={lane} jump={jump} />
      <Partner distance={10} />
      <Ground phase={phase} />

      {obstacles.map(o => (
        <Obstacle 
            key={o.id} 
            position={[(o.lane - 1) * LANE_WIDTH, 0, o.z]} 
            type={o.type} 
        />
      ))}
    </>
  );
}

export function GameWorld() {
  return (
    <div id="game-canvas">
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 50 }}>
        <Suspense fallback={null}>
            <GameScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
