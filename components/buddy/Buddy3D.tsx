import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import * as THREE from 'three'
import { BuddyState } from '@/lib/buddy/events'

useGLTF.preload('/models/virasat-buddy.glb')

export function Buddy3D({ state, payload }: { state: BuddyState, payload?: any }) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/virasat-buddy.glb')
  
  const clonedScene = useMemo(() => scene.clone(), [scene])

  const [reducedMotion, setReducedMotion] = React.useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(m.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    m.addEventListener('change', listener)
    return () => m.removeEventListener('change', listener)
  }, [])

  // Internal state for bouncing/pulsing to avoid conflicting with standard lerp
  const animState = useRef({ bootProgress: 0 })

  useFrame((rootState, delta) => {
    if (!group.current) return

    let targetRotation = new THREE.Euler(0, 0, 0)
    let targetScale = new THREE.Vector3(1, 1, 1)
    let targetYOffset = 0
    let lerpSpeed = 5

    const time = rootState.clock.elapsedTime

    switch (state) {
      case 'BOOTING':
        // Start from reduced scale, small rotation/tilt, settle into IDLE
        targetScale.setScalar(0.8 + Math.min(0.2, time * 0.5))
        targetRotation.y = Math.sin(time * 5) * 0.2
        targetRotation.x = Math.sin(time * 3) * 0.1
        targetYOffset = Math.sin(time * 6) * 0.1
        break
      case 'REBOOTING':
        // unstable/rotating motion, slight scale-down, quick reset
        targetScale.setScalar(0.7)
        targetRotation.y = time * 15
        targetRotation.z = Math.sin(time * 20) * 0.3
        targetRotation.x = Math.cos(time * 15) * 0.3
        targetYOffset = (Math.random() - 0.5) * 0.2
        lerpSpeed = 15
        break
      case 'GREETING':
        // Wake up, slight upward movement, friendly greeting
        targetYOffset = 0.3
        targetRotation.z = Math.sin(time * 6) * 0.2
        targetRotation.y = Math.sin(time * 4) * 0.3
        targetScale.setScalar(1.05)
        break
      case 'EXPLAINING':
        // Attentive/explanatory state, forward tilt/curious posture
        targetRotation.x = 0.2
        targetRotation.y = Math.sin(time * 1) * 0.1
        targetYOffset = 0.1
        lerpSpeed = 4
        break
      case 'WEATHER_ALERT':
        // Concerned/surprised reaction, backward/side tilt, alert motion
        targetRotation.x = -0.3
        targetRotation.z = 0.2
        targetScale.set(0.9, 1.1, 0.9)
        targetYOffset = 0.2
        lerpSpeed = 12
        break
      case 'WEATHER_HELP':
        // Transition from concerned to reassuring, small positive bounce
        targetRotation.x = 0.1
        targetScale.setScalar(1.1)
        targetYOffset = Math.abs(Math.sin(time * 8)) * 0.2
        lerpSpeed = 8
        break
      case 'ROUTE_CHANGED':
        // Brief surprised/attentive reaction, look/tilt toward new direction
        if (payload?.direction === 'left') targetRotation.y = 0.5
        else if (payload?.direction === 'right') targetRotation.y = -0.5
        else if (payload?.direction === 'back') targetRotation.y = Math.PI
        else targetRotation.y = 0 // forward
        
        targetRotation.x = -0.2 // attentive
        targetScale.set(1.1, 1.1, 1.1)
        targetYOffset = 0.2
        lerpSpeed = 10
        break
      case 'UTILITY':
        // Subtle informative reaction, attentive pose
        targetRotation.x = -0.1
        targetRotation.z = 0.1
        targetYOffset = 0.1
        targetScale.setScalar(1.02)
        break
      case 'POPULARITY':
        // Impressed/excited reaction, slightly larger bounce
        targetScale.setScalar(1.15)
        targetYOffset = Math.abs(Math.sin(time * 8)) * 0.4
        targetRotation.y = Math.sin(time * 4) * 0.3
        break
      case 'SPECIAL_EVENT':
        // Surprised/celebratory reaction, brief bounce
        targetScale.setScalar(1.2)
        targetYOffset = Math.abs(Math.sin(time * 12)) * 0.3
        targetRotation.z = Math.sin(time * 8) * 0.3
        targetRotation.y = time * 4
        lerpSpeed = 8
        break
      case 'THINKING':
        targetRotation.x = -0.2
        targetRotation.y = Math.sin(time * 2) * 0.2
        break
      case 'CLICKED':
        targetScale.setScalar(1.1)
        targetYOffset = Math.sin(time * 15) * 0.2
        lerpSpeed = 10
        break
      case 'PRESSED':
        targetScale.set(1.1, 0.9, 1.1)
        targetYOffset = -0.2
        targetRotation.x = 0.1
        lerpSpeed = 8
        break
      case 'DRAGGING':
        if (payload?.direction === 'left') {
          targetRotation.z = 0.3
          targetRotation.y = -0.3
        } else if (payload?.direction === 'right') {
          targetRotation.z = -0.3
          targetRotation.y = 0.3
        } else if (payload?.direction === 'up') {
          targetRotation.x = -0.4
          targetYOffset = 0.2
        } else if (payload?.direction === 'down') {
          targetRotation.x = 0.4
          targetYOffset = -0.2
        }
        lerpSpeed = 10
        break
      case 'LOADING_MAP':
        targetRotation.x = -0.3
        targetRotation.y = Math.sin(time * 3) * 0.2
        break
      case 'LOADING_REVIEWS':
        targetRotation.z = Math.sin(time * 2) * 0.1
        targetScale.setScalar(0.95 + Math.sin(time * 4) * 0.05)
        break
      case 'REVIEW_EXCITED':
        targetScale.setScalar(1.1)
        targetYOffset = Math.abs(Math.sin(time * 10)) * 0.3
        targetRotation.y = time * 5
        break
      case 'FAVORITED':
        targetScale.setScalar(1.2 + Math.sin(time * 8) * 0.1)
        targetRotation.z = Math.sin(time * 5) * 0.2
        targetYOffset = Math.abs(Math.sin(time * 8)) * 0.3
        break
      case 'JOURNEY_ADD':
        // Short excited/acknowledging animation
        targetScale.set(1.05, 1.15, 1.05)
        targetRotation.x = 0.2
        targetRotation.y = Math.sin(time * 15) * 0.2
        targetYOffset = Math.abs(Math.sin(time * 12)) * 0.2
        break
      case 'DNA_MATCH':
        targetScale.setScalar(1.2)
        targetRotation.y = Math.sin(time * 10) * 0.5
        targetRotation.x = -0.2 + Math.sin(time * 15) * 0.1
        targetYOffset = Math.abs(Math.sin(time * 12)) * 0.2
        break
      case 'IDLE':
      default:
        // Subtle floating/bobbing, very small tilt
        targetRotation.y = Math.sin(time * 0.2) * 0.05
        targetRotation.z = Math.cos(time * 0.15) * 0.02
        break
    }

    if (reducedMotion) {
      targetRotation.x *= 0.2
      targetRotation.y *= 0.2
      targetRotation.z *= 0.2
      targetYOffset *= 0.2
      lerpSpeed *= 0.5
    }

    // Apply smoothly
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotation.x, delta * lerpSpeed)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation.y, delta * lerpSpeed)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotation.z, delta * lerpSpeed)
    group.current.scale.lerp(targetScale, delta * lerpSpeed)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetYOffset, delta * lerpSpeed)
  })

  return (
    <Float
      speed={state === 'IDLE' ? 1.5 : 1} 
      rotationIntensity={0}
      floatIntensity={reducedMotion ? 0 : (state === 'IDLE' ? 0.5 : 0.1)}
      floatingRange={reducedMotion ? [0, 0] : [-0.1, 0.1]}
    >
      <group ref={group}>
        <primitive object={clonedScene} position={[0, -1, 0]} />
      </group>
    </Float>
  )
}
