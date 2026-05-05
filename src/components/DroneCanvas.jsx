import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import DroneModel from './DroneModel'

/**
 * CameraRig - Smooth mouse-tracking camera movement
 * Creates parallax effect as user moves mouse
 */
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  // Track mouse position
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    })
  }

  useFrame(() => {
    // Smoothly interpolate camera position based on mouse
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (-mouse.current.y * 0.3 + 1.5 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Particles - Floating particles in the scene for atmosphere
 */
function Particles({ count = 200 }) {
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.02
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#C9A87C"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * GroundGrid - Holographic ground grid
 */
function GroundGrid() {
  return (
    <group position={[0, -2.5, 0]}>
      <gridHelper
        args={[30, 30, '#A07848', 'rgba(201, 168, 124, 0.018)']}
      />
      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#05070a"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

/**
 * DroneCanvas - Main 3D canvas containing the fixed wing UAV scene
 * Wraps the Three.js scene with lighting, environment, and camera
 */
export default function DroneCanvas({ disassemble = 0, highlightPart = null, landed = false }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup - green/gold themed */}
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            color="#e0f2e8"
            castShadow
          />
          <directionalLight
            position={[-5, 3, -5]}
            intensity={0.3}
            color="#E2C49A"
          />
          <pointLight position={[0, 2, 0]} intensity={0.5} color="#C9A87C" />
          <pointLight position={[3, -1, 2]} intensity={0.25} color="#4A9EBF" />

          {/* Rim light for dramatic effect */}
          <spotLight
            position={[-3, 5, -3]}
            intensity={0.4}
            color="#D4A843"
            angle={0.5}
            penumbra={1}
          />

          {/* Camera tracking */}
          <CameraRig />

          {/* Background elements */}
          <Stars
            radius={50}
            depth={50}
            count={2000}
            factor={3}
            saturation={0}
            fade
            speed={0.5}
          />
          <Particles count={150} />
          <GroundGrid />

          {/* Environment map for reflections */}
          <Environment preset="night" />

          {/* Fog for depth */}
          <fog attach="fog" args={['#05070a', 8, 25]} />

          {/* The Fixed Wing UAV */}
          <Float
            speed={landed ? 0 : 1.5}
            rotationIntensity={landed ? 0 : 0.15}
            floatIntensity={landed ? 0 : 0.3}
          >
            <DroneModel
              disassemble={disassemble}
              highlightPart={highlightPart}
              landed={landed}
            />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  )
}
