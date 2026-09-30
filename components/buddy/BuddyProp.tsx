import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BuddyState } from '@/lib/buddy/events'

export type BuddyPropType = "MAP" | "INFO" | "ROUTE" | "RECOMMENDATION"

export function BuddyProp({ state }: { state: BuddyState }) {
  const group = useRef<THREE.Group>(null)
  
  const [activeProp, setActiveProp] = useState<BuddyPropType | null>(null)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const animTime = useRef(0)

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(m.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    m.addEventListener('change', listener)
    return () => m.removeEventListener('change', listener)
  }, [])

  // Particle system refs
  const particlesRef = useRef<THREE.Points>(null)
  const particlesData = useRef(
    Array.from({ length: 15 }).map(() => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0
    }))
  )
  const [particlesGeometry] = useState(() => new THREE.BufferGeometry())

  useEffect(() => {
    let newProp: BuddyPropType | null = null
    if (state === 'LOADING_MAP') newProp = 'MAP'
    else if (state === 'EXPLAINING') newProp = 'INFO'
    else if (state === 'ROUTE_CHANGED') newProp = 'ROUTE'
    else if (state === 'DNA_MATCH') newProp = 'RECOMMENDATION'

    if (newProp) {
      if (activeProp !== newProp) {
        setActiveProp(newProp)
        setIsAnimatingOut(false)
        animTime.current = 0
        
        // Reset particles for appear
        particlesData.current.forEach(p => {
          p.position.set((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2)
          p.velocity.set((Math.random() - 0.5) * 2, Math.random() * 2, (Math.random() - 0.5) * 2)
          p.life = reducedMotion ? 0 : 1
        })
      }
    } else if (activeProp && !isAnimatingOut) {
      // Disappear
      setIsAnimatingOut(true)
      animTime.current = 0
      
      // Reset particles for disappear
      particlesData.current.forEach(p => {
        p.position.set((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8)
        p.velocity.set((Math.random() - 0.5) * 2, -Math.random() * 2, (Math.random() - 0.5) * 2)
        p.life = reducedMotion ? 0 : 1
      })
    }
  }, [state, activeProp, isAnimatingOut, reducedMotion])

  useFrame((_, delta) => {
    if (!group.current || !activeProp) return

    animTime.current += delta
    const t = animTime.current

    // Update Particles
    if (particlesRef.current && (t < 1.0) && !reducedMotion) {
      const positions = new Float32Array(particlesData.current.length * 3)
      particlesData.current.forEach((p, i) => {
        p.life -= delta * 1.5
        if (p.life > 0) {
          p.position.addScaledVector(p.velocity, delta)
          positions[i * 3] = p.position.x
          positions[i * 3 + 1] = p.position.y
          positions[i * 3 + 2] = p.position.z
        }
      })
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      ;(particlesRef.current.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - t)
    } else if (particlesRef.current) {
      ;(particlesRef.current.material as THREE.PointsMaterial).opacity = 0
    }

    const propMesh = group.current.getObjectByName('prop-mesh')
    
    if (propMesh) {
      if (isAnimatingOut) {
        // Disappear: fold/shrink
        const progress = Math.min(1, t * (reducedMotion ? 3 : 2))
        const scale = 1 - Math.pow(progress, 2)
        
        propMesh.scale.set(Math.max(0.01, scale), Math.max(0.01, scale), Math.max(0.01, scale))
        if (!reducedMotion) {
          propMesh.rotation.y = THREE.MathUtils.lerp(0, Math.PI, progress)
        }
        
        if (progress >= 1) {
          setActiveProp(null)
          setIsAnimatingOut(false)
        }
      } else {
        // Appear
        const progress = Math.min(1, t * (reducedMotion ? 3 : 1.5))
        
        const easeOutBack = (x: number): number => {
          const c1 = 1.70158; const c3 = c1 + 1;
          return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        }
        
        const scale = progress < 1 ? easeOutBack(progress) : 1
        propMesh.scale.set(Math.max(0.01, scale), Math.max(0.01, scale), Math.max(0.01, scale))
        
        if (!reducedMotion) {
          propMesh.rotation.y = THREE.MathUtils.lerp(-Math.PI/2, 0, progress)
          // Floating hover effect while visible
          if (progress >= 1) {
            propMesh.position.y = Math.sin(t * 2) * 0.05
          } else {
            propMesh.position.y = 0
          }
        }
      }
    }
  })

  if (!activeProp) return null

  // Place it near the right side of Buddy
  return (
    <group position={[1.2, -0.2, 0.5]} ref={group}>
      <group name="prop-mesh">
        {activeProp === 'MAP' && <MapGeometry />}
        {activeProp === 'INFO' && <InfoGeometry />}
        {activeProp === 'ROUTE' && <RouteGeometry />}
        {activeProp === 'RECOMMENDATION' && <RecommendationGeometry />}
      </group>
      
      {/* Subtle magical shimmer particles */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial 
          size={0.08} 
          color={activeProp === 'RECOMMENDATION' ? "#a855f7" : "#facc15"} 
          transparent 
          opacity={0} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function MapGeometry() {
  return (
    <group rotation={[0.1, -0.2, 0.1]}>
      <mesh>
        <boxGeometry args={[0.9, 0.7, 0.02]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, 0, 0.012]}>
        <boxGeometry args={[0.015, 0.7, 0.01]} />
        <meshStandardMaterial color="#e0d5c1" />
      </mesh>
      <mesh position={[0.15, 0, 0.012]}>
        <boxGeometry args={[0.015, 0.7, 0.01]} />
        <meshStandardMaterial color="#e0d5c1" />
      </mesh>
      <mesh position={[0.1, 0.15, 0.015]}>
        <cylinderGeometry args={[0.03, 0.01, 0.02, 8]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#e4b08d" />
      </mesh>
      <mesh position={[-0.1, -0.1, 0.012]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.3, 0.03, 0.01]} />
        <meshStandardMaterial color="#6a8a7a" />
      </mesh>
      <mesh position={[0.25, -0.2, 0.015]}>
        <boxGeometry args={[0.15, 0.08, 0.01]} />
        <meshStandardMaterial color="#d1c4b2" />
      </mesh>
    </group>
  )
}

function InfoGeometry() {
  // A floating heritage scroll/card
  return (
    <group rotation={[0.1, -0.15, -0.05]}>
      <mesh>
        <boxGeometry args={[0.7, 0.9, 0.02]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.8} />
      </mesh>
      {/* Scroll headers/footers */}
      <mesh position={[0, 0.45, 0.01]}>
        <cylinderGeometry args={[0.04, 0.04, 0.75]} rotation={[0, 0, Math.PI/2]} />
        <meshStandardMaterial color="#b39b7d" />
      </mesh>
      <mesh position={[0, -0.45, 0.01]}>
        <cylinderGeometry args={[0.04, 0.04, 0.75]} rotation={[0, 0, Math.PI/2]} />
        <meshStandardMaterial color="#b39b7d" />
      </mesh>
      {/* Text lines (stylized) */}
      <mesh position={[0, 0.2, 0.015]}>
        <boxGeometry args={[0.4, 0.03, 0.01]} />
        <meshStandardMaterial color="#a3907c" />
      </mesh>
      <mesh position={[-0.05, 0.1, 0.015]}>
        <boxGeometry args={[0.3, 0.02, 0.01]} />
        <meshStandardMaterial color="#c2b2a1" />
      </mesh>
      <mesh position={[0.05, 0.05, 0.015]}>
        <boxGeometry args={[0.5, 0.02, 0.01]} />
        <meshStandardMaterial color="#c2b2a1" />
      </mesh>
      <mesh position={[0, -0.05, 0.015]}>
        <boxGeometry args={[0.4, 0.02, 0.01]} />
        <meshStandardMaterial color="#c2b2a1" />
      </mesh>
    </group>
  )
}

function RouteGeometry() {
  // A small compass/route marker
  const compassRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (compassRef.current) compassRef.current.rotation.y += delta * 2
  })

  return (
    <group rotation={[0.3, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#e0d5c1" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.01, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Compass needle */}
      <group position={[0, 0.07, 0]} ref={compassRef}>
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.04, 0.02, 0.2]} />
          <meshStandardMaterial color="#e43b3b" />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.04, 0.02, 0.2]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </group>
    </group>
  )
}

function RecommendationGeometry() {
  // A glowing crystal/gem shape indicating heritage match
  const gemRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (gemRef.current) {
      gemRef.current.rotation.y += delta
      gemRef.current.rotation.z += delta * 0.5
    }
  })

  return (
    <group ref={gemRef}>
      <mesh>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial 
          color="#d97706" 
          emissive="#b45309"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8} 
        />
      </mesh>
      {/* Outer ring */}
      <mesh rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[0.45, 0.02, 16, 32]} />
        <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
