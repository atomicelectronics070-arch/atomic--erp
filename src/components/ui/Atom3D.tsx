"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Line, Preload } from "@react-three/drei";
import * as THREE from "three";

// Atom Core
const Core = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coreRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={coreRef} args={[0.5, 32, 32]}>
      <meshBasicMaterial color="#0055fe" toneMapped={false} />
    </Sphere>
  );
};

// Electron Ring
const Ring = ({ radius, speed, rotationX, rotationY, color = "#ffffff", opacity = 0.4, electronColor = "#ffffff" }: { radius: number, speed: number, rotationX: number, rotationY: number, color?: string, opacity?: number, electronColor?: string }) => {
  const ringRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.3), 0));
    }
    return pts;
  }, [radius]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += speed;
    }
  });

  return (
    <group ref={ringRef} rotation={[rotationX, rotationY, 0]}>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={opacity} />
      {/* Electron */}
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={electronColor} toneMapped={false} />
      </mesh>
    </group>
  );
};

const AtomScene = ({ theme }: { theme: 'light' | 'dark' }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const ringColor = theme === 'light' ? "#000000" : "#ffffff";
  const ringOpacity = theme === 'light' ? 0.2 : 0.4;
  const electronColor = theme === 'light' ? "#000000" : "#ffffff";

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle overall floating rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Follow mouse slightly
      const targetX = (state.mouse.x * Math.PI) / 10;
      const targetY = (state.mouse.y * Math.PI) / 10;
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Core />
      <Ring radius={2.5} speed={0.01} rotationX={0} rotationY={0} color={ringColor} opacity={ringOpacity} electronColor={electronColor} />
      <Ring radius={2.5} speed={0.015} rotationX={Math.PI / 3} rotationY={Math.PI / 3} color={ringColor} opacity={ringOpacity} electronColor={electronColor} />
      <Ring radius={2.5} speed={0.012} rotationX={-Math.PI / 3} rotationY={Math.PI / 3} color={ringColor} opacity={ringOpacity} electronColor={electronColor} />
    </group>
  );
};

export default function Atom3D({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  return (
    <div className="w-full h-full min-h-[400px] absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <AtomScene theme={theme} />
        <Preload all />
      </Canvas>
    </div>
  );
}
