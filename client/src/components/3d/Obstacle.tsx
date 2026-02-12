import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface ObstacleProps {
  position: [number, number, number];
  type: "heart" | "emoji" | "bomb" | "brokenheart";
}

export function Obstacle({ position, type }: ObstacleProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation for visual appeal
      groupRef.current.rotation.y = state.clock.elapsedTime * 2;
      // Gentle bobbing
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  // GOOD: Hearts to collect
  if (type === "heart") {
    return (
      <group ref={groupRef} position={position}>
        {/* Main heart body - better 3D shape */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color="#FF1744" 
            emissive="#FF1744"
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        
        {/* Left lobe */}
        <mesh position={[-0.28, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial 
            color="#FF1744" 
            emissive="#FF1744"
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        
        {/* Right lobe */}
        <mesh position={[0.28, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial 
            color="#FF1744" 
            emissive="#FF1744"
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        
        {/* Bottom point */}
        <mesh position={[0, -0.3, 0]} castShadow rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.3, 0.4, 4]} />
          <meshStandardMaterial 
            color="#FF1744" 
            emissive="#FF1744"
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        
        {/* Sparkle effect */}
        <mesh position={[0.3, 0.3, 0.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.25, 0.25, 0.2]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Glow effect - larger and more visible */}
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#FF69B4" transparent opacity={0.25} />
        </mesh>
        
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[1.0, 16, 16]} />
          <meshBasicMaterial color="#FFB6C1" transparent opacity={0.12} />
        </mesh>
      </group>
    );
  }

  // BAD: Bombs to avoid
  if (type === "bomb") {
    return (
      <group ref={groupRef} position={[position[0], position[1] + 0.8, position[2]]}>
        {/* Bomb sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Fuse */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Spark */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color="#FF4500" 
            emissive="#FF4500"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Warning glow */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color="#FF0000" transparent opacity={0.15} />
        </mesh>
      </group>
    );
  }

  // BAD: Broken hearts to avoid
  if (type === "brokenheart") {
    return (
      <group ref={groupRef} position={position}>
        <Text
          fontSize={1.2}
          color="#8B0000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          💔
        </Text>
        
        {/* Dark glow */}
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#8B0000" transparent opacity={0.2} />
        </mesh>
      </group>
    );
  }

  // Love Emojis (also collectible)
  const emojis = ["💕", "💖", "💗", "💝", "💓", "💞", "💘"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <group ref={groupRef} position={position}>
      <Text
        fontSize={1.2}
        color="#FF1744"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#FFFFFF"
      >
        {randomEmoji}
      </Text>
      
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#FFB6C1" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
