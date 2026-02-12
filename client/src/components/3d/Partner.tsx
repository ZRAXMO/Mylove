import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PartnerProps {
  distance: number;
  partnerImage: string | null;
}

export function Partner({ distance, partnerImage }: PartnerProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (partnerImage) {
      const loader = new THREE.TextureLoader();
      loader.load(partnerImage, (tex) => {
        setTexture(tex);
      });
    }
  }, [partnerImage]);

  useFrame((state) => {
    if (spriteRef.current) {
      // Gentle bobbing
      spriteRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Shadow */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={1} transparent />
      </mesh>
      
      {/* Partner Image */}
      {texture ? (
        <sprite ref={spriteRef} scale={[1.5, 2, 1]}>
          <spriteMaterial 
            map={texture} 
            transparent 
            depthWrite={false}
          />
        </sprite>
      ) : (
        /* Better placeholder - Pink circle */
        <>
          <mesh position={[0, 1.2, 0]}>
            <circleGeometry args={[0.6, 32]} />
            <meshStandardMaterial 
              color="#FFB6C1" 
              emissive="#FF69B4"
              emissiveIntensity={0.3}
            />
          </mesh>
          <sprite ref={spriteRef} scale={[0.8, 0.8, 1]} position={[0, 1.2, 0]}>
            <spriteMaterial color="#FFFFFF" opacity={0.8} transparent />
          </sprite>
        </>
      )}
    </group>
  );
}
