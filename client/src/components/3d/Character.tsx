import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CharacterProps {
  lane: number;
  jump: boolean;
  playerImage: string | null;
}

export function Character({ lane, jump, playerImage }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (playerImage) {
      const loader = new THREE.TextureLoader();
      loader.load(playerImage, (tex) => {
        setTexture(tex);
      });
    }
  }, [playerImage]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const LANE_WIDTH = 2.5;
    const targetX = (lane - 1) * LANE_WIDTH;
    
    // Smooth lane movement
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * delta * 8;

    // Jump animation
    if (jump) {
      const jumpHeight = 2.5;
      const currentY = groupRef.current.position.y;
      groupRef.current.position.y += (jumpHeight - currentY) * delta * 12;
    } else {
      // Return to ground
      const groundY = 1.2;
      const currentY = groupRef.current.position.y;
      groupRef.current.position.y += (groundY - currentY) * delta * 8;
    }

    // Billboard effect - sprite always faces camera
    if (spriteRef.current) {
      spriteRef.current.material.rotation = 0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.2, 6]}>
      {/* Shadow on ground */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
      
      {/* Player Image */}
      {texture ? (
        <sprite ref={spriteRef} scale={[1.5, 2, 1]}>
          <spriteMaterial 
            map={texture} 
            transparent 
            depthWrite={false}
          />
        </sprite>
      ) : (
        /* Better placeholder - Pink circle with heart */
        <>
          <mesh>
            <circleGeometry args={[0.6, 32]} />
            <meshStandardMaterial 
              color="#FF69B4" 
              emissive="#FF1744"
              emissiveIntensity={0.3}
            />
          </mesh>
          <sprite scale={[0.8, 0.8, 1]}>
            <spriteMaterial color="#FFFFFF" opacity={0.9} transparent />
          </sprite>
        </>
      )}
    </group>
  );
}

