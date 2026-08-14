"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, Torus, Box, Cone, Cylinder, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface CategoryBadge3DProps {
  categoryId: string
  color?: string
}

function CategoryMesh({ categoryId }: { categoryId: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.2
      meshRef.current.rotation.x += delta * 0.4
    }
  })

  switch (categoryId) {
    case 'industrial':
      return (
        <Torus ref={meshRef} args={[0.7, 0.25, 16, 32]}>
          <meshStandardMaterial color="#3b82f6" metalness={0.9} roughness={0.1} />
        </Torus>
      )
    case 'servicios':
      return (
        <Sphere ref={meshRef} args={[0.8, 32, 32]}>
          <MeshWobbleMaterial color="#0066ff" factor={0.6} speed={2} metalness={0.8} roughness={0.1} />
        </Sphere>
      )
    case 'computacion':
      return (
        <Box ref={meshRef} args={[1, 0.7, 0.4]}>
          <meshStandardMaterial color="#6366f1" metalness={0.85} roughness={0.15} />
        </Box>
      )
    case 'telefonia':
      return (
        <Box ref={meshRef} args={[0.5, 1.1, 0.2]}>
          <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.1} />
        </Box>
      )
    case 'minipc':
      return (
        <Box ref={meshRef} args={[0.8, 0.8, 0.8]}>
          <meshStandardMaterial color="#3b82f6" metalness={0.95} roughness={0.05} />
        </Box>
      )
    case 'monitores':
      return (
        <Cylinder ref={meshRef} args={[0.8, 0.8, 0.2, 32]}>
          <meshStandardMaterial color="#1d4ed8" metalness={0.9} roughness={0.1} />
        </Cylinder>
      )
    case 'tablets-infantiles':
      return (
        <Sphere ref={meshRef} args={[0.75, 24, 24]}>
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
        </Sphere>
      )
    case 'portones-automaticos':
      return (
        <Box ref={meshRef} args={[1.1, 0.5, 0.3]}>
          <meshStandardMaterial color="#1e40af" metalness={0.95} roughness={0.1} />
        </Box>
      )
    case 'hogar':
      return (
        <Cone ref={meshRef} args={[0.7, 1, 32]}>
          <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
        </Cone>
      )
    case 'software':
      return (
        <Torus ref={meshRef} args={[0.65, 0.2, 16, 32]}>
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </Torus>
      )
    case 'tecnologia-residencial':
      return (
        <Sphere ref={meshRef} args={[0.8, 16, 16]}>
          <meshStandardMaterial color="#2563eb" metalness={0.9} roughness={0.1} wireframe />
        </Sphere>
      )
    case 'electronica':
    default:
      return (
        <Box ref={meshRef} args={[0.7, 0.7, 0.7]}>
          <meshStandardMaterial color="#60a5fa" metalness={0.95} roughness={0.05} />
        </Box>
      )
  }
}

export default function CategoryBadge3D({ categoryId }: CategoryBadge3DProps) {
  return (
    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-900/80 border border-blue-400/40 overflow-hidden shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,102,255,0.3)] shrink-0 pointer-events-none relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#60a5fa" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#38bdf8" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CategoryMesh categoryId={categoryId} />
        </Float>
      </Canvas>
    </div>
  )
}
