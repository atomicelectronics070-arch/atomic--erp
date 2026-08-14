"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Line, Preload, Float } from '@react-three/drei'
import * as THREE from 'three'

// 4K Glowing Core Nucleus
function Nucleus() {
  const coreRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8
      coreRef.current.rotation.x += delta * 0.4
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08
      coreRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={coreRef}>
      {/* Central Light Source */}
      <pointLight intensity={3.5} distance={10} color="#38bdf8" />
      <pointLight intensity={2} distance={8} color="#60a5fa" />
      
      {/* Main Core Sphere */}
      <Sphere args={[0.55, 32, 32]}>
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Halo Shell */}
      <Sphere args={[0.75, 32, 32]}>
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.25}
          wireframe
        />
      </Sphere>
    </group>
  )
}

// Quantum Electron Shell Ring with Particle Trail
function QuantumRing({
  radius,
  speed,
  rotationX,
  rotationY,
  color = "#38bdf8",
  electronColor = "#ffffff"
}: {
  radius: number
  speed: number
  rotationX: number
  rotationY: number
  color?: string
  electronColor?: string
}) {
  const groupRef = useRef<THREE.Group>(null)

  const points = useMemo(() => {
    const pts = []
    const count = 100
    for (let i = 0; i <= count; i++) {
      const angle = (i / count) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * (radius * 0.38), 0))
    }
    return pts
  }, [radius])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += speed * delta * 60
    }
  })

  return (
    <group ref={groupRef} rotation={[rotationX, rotationY, 0]}>
      {/* Orbit Ring Line */}
      <Line
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.65}
      />
      {/* Orbiting Electron Sphere */}
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={electronColor} toneMapped={false} />
      </mesh>
      <mesh position={[-radius, 0, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>
    </group>
  )
}

// Main 3D Atom Scene
function AtomScene() {
  const mainGroupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (mainGroupRef.current) {
      const targetX = (state.mouse.x * Math.PI) / 8
      const targetY = (state.mouse.y * Math.PI) / 8

      mainGroupRef.current.rotation.y += (targetX - mainGroupRef.current.rotation.y) * 0.05
      mainGroupRef.current.rotation.x += (-targetY - mainGroupRef.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={mainGroupRef}>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <Nucleus />
        <QuantumRing radius={2.6} speed={0.015} rotationX={0} rotationY={0} color="#38bdf8" electronColor="#ffffff" />
        <QuantumRing radius={2.6} speed={0.022} rotationX={Math.PI / 3} rotationY={Math.PI / 4} color="#60a5fa" electronColor="#38bdf8" />
        <QuantumRing radius={2.6} speed={0.018} rotationX={-Math.PI / 3} rotationY={Math.PI / 4} color="#0284c7" electronColor="#ffffff" />
        <QuantumRing radius={2.6} speed={0.025} rotationX={Math.PI / 2} rotationY={-Math.PI / 6} color="#93c5fd" electronColor="#60a5fa" />
      </Float>
    </group>
  )
}

export default function Atom3D4K() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={1.2} />
        <AtomScene />
        <Preload all />
      </Canvas>
    </div>
  )
}
