import { Cloud, Sky } from "@react-three/drei";
import * as THREE from "three";

export function Environment() {
  return (
    <>
      {/* Beautiful Blue Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.1}
      />
      
      {/* Blue background color */}
      <color attach="background" args={["#87CEEB"]} />

      {/* Ambient light */}
      <ambientLight intensity={0.7} />
      
      {/* Directional light for shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light */}
      <pointLight position={[-10, 10, -10]} intensity={0.4} />

      {/* Beautiful White Clouds */}
      <Cloud opacity={0.4} speed={0.2} segments={20} position={[-10, 12, -20]} color="#FFFFFF" />
      <Cloud opacity={0.35} speed={0.25} segments={20} position={[12, 15, -25]} color="#FFFFFF" />
      <Cloud opacity={0.4} speed={0.15} segments={20} position={[0, 18, -30]} color="#FFFFFF" />
      <Cloud opacity={0.3} speed={0.3} segments={20} position={[-8, 14, -28]} color="#FFFFFF" />
      <Cloud opacity={0.35} speed={0.2} segments={20} position={[8, 16, -35]} color="#FFFFFF" />

      {/* Narrower Road - Gray Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial 
          color="#5a5d6b" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Road Shadow/Depth Effect */}
      <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 200]} />
        <meshBasicMaterial 
          color="#4a4d5b" 
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Road lanes - narrower spacing */}
      <group position={[0, 0.01, 0]}>
        {/* Left white line */}
        <mesh position={[-2.5, 0, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 200]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.9} transparent />
        </mesh>
        
        {/* Right white line */}
        <mesh position={[2.5, 0, -50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 200]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.9} transparent />
        </mesh>

        {/* Center dashed lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[0, 0, -i * 10]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.12, 4]} />
            <meshStandardMaterial color="#FFFFFF" opacity={0.7} transparent />
          </mesh>
        ))}
      </group>

      {/* Road edges shadow */}
      <mesh position={[-4, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 200]} />
        <meshBasicMaterial color="#000000" opacity={0.2} transparent />
      </mesh>
      <mesh position={[4, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 200]} />
        <meshBasicMaterial color="#000000" opacity={0.2} transparent />
      </mesh>
    </>
  );
}
