import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * DroneModel - Fixed Wing UAV matching white reference image
 *
 * - Off-white semi-gloss fuselage with sharp nose spinner
 * - Dark canopy sloping from nose up to wing root
 * - High-mounted straight wings with upturned winglets
 * - Dark solar/carbon panel strips on wing tops
 * - Conventional tail (1 vertical fin + 2 horizontal stabs)
 * - Tail-dragger landing gear (2 main wheels + tail wheel)
 * - 2-blade black tractor propeller at nose tip
 */

/* ── Materials ── */
function useMats() {
  return useMemo(() => ({
    // Off-white body - semi-gloss composite
    body: new THREE.MeshPhysicalMaterial({
      color: '#e8e8e0',
      metalness: 0.05,
      roughness: 0.28,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
    }),
    // Dark canopy
    canopy: new THREE.MeshPhysicalMaterial({
      color: '#0a1210',
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    }),
    // Wing surface (slightly off-white)
    wing: new THREE.MeshPhysicalMaterial({
      color: '#e0e0d8',
      metalness: 0.05,
      roughness: 0.32,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    }),
    // Dark panel strips (solar/carbon)
    darkPanel: new THREE.MeshStandardMaterial({
      color: '#1a2520',
      metalness: 0.25,
      roughness: 0.55,
    }),
    // Tail surfaces
    tail: new THREE.MeshPhysicalMaterial({
      color: '#dcdcd5',
      metalness: 0.05,
      roughness: 0.32,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    }),
    // Dark fin leading edge
    finDark: new THREE.MeshStandardMaterial({
      color: '#151e1a',
      metalness: 0.2,
      roughness: 0.5,
    }),
    // Propeller (black)
    prop: new THREE.MeshStandardMaterial({
      color: '#080808',
      metalness: 0.4,
      roughness: 0.35,
      side: THREE.DoubleSide,
    }),
    // Spinner / motor dark
    spinner: new THREE.MeshStandardMaterial({
      color: '#0e0e0e',
      metalness: 0.85,
      roughness: 0.12,
    }),
    // Landing gear (dark grey)
    gear: new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      metalness: 0.5,
      roughness: 0.4,
    }),
    // Wheel rubber
    wheel: new THREE.MeshStandardMaterial({
      color: '#111111',
      metalness: 0.1,
      roughness: 0.85,
    }),
    // LED green (nav)
    ledG: new THREE.MeshStandardMaterial({
      color: '#34D399', emissive: '#34D399',
      emissiveIntensity: 2.5, toneMapped: false,
    }),
    // LED red (nav)
    ledR: new THREE.MeshStandardMaterial({
      color: '#ff4444', emissive: '#ff4444',
      emissiveIntensity: 2.5, toneMapped: false,
    }),
    // Accent line (cyan glow)
    accent: new THREE.MeshStandardMaterial({
      color: '#34D399', emissive: '#34D399',
      emissiveIntensity: 0.8, toneMapped: false,
    }),
    // Gold accent
    gold: new THREE.MeshStandardMaterial({
      color: '#38BDF8', emissive: '#38BDF8',
      emissiveIntensity: 0.35, metalness: 0.8, roughness: 0.15,
    }),
    // Battery
    batt: new THREE.MeshPhysicalMaterial({
      color: '#1a2420', metalness: 0.3, roughness: 0.5, clearcoat: 0.2,
    }),
    battLabel: new THREE.MeshStandardMaterial({
      color: '#34D399', emissive: '#34D399', emissiveIntensity: 0.5,
    }),
  }), [])
}

/* ── Fuselage (LatheGeometry pod shape) ── */
function useFuselageGeo() {
  return useMemo(() => {
    const pts = []
    const N = 48
    for (let i = 0; i <= N; i++) {
      const t = i / N // 0=nose tip  1=tail end
      let r
      if (t < 0.04) {
        // Sharp spinner tip
        r = t / 0.04 * 0.018
      } else if (t < 0.12) {
        // Spinner to nose swell
        const s = (t - 0.04) / 0.08
        r = 0.018 + s * s * 0.052
      } else if (t < 0.3) {
        // Bulbous front pod
        const s = (t - 0.12) / 0.18
        r = 0.07 + 0.03 * Math.sin(s * Math.PI * 0.5)
      } else if (t < 0.6) {
        // Main body - widest, gentle taper
        const s = (t - 0.3) / 0.3
        r = 0.1 - s * 0.018
      } else if (t < 0.8) {
        // Rear taper
        const s = (t - 0.6) / 0.2
        r = 0.082 - s * 0.035
      } else {
        // Tail boom
        const s = (t - 0.8) / 0.2
        r = 0.047 - s * 0.022
      }
      pts.push(new THREE.Vector2(Math.max(r, 0.002), (t - 0.42) * 1.15))
    }
    return new THREE.LatheGeometry(pts, 32)
  }, [])
}

/* ── Propeller Blade ── */
function Blade({ material }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.quadraticCurveTo(0.06, 0.05, 0.35, 0.032)
    s.quadraticCurveTo(0.44, 0.018, 0.5, 0)
    s.quadraticCurveTo(0.44, -0.018, 0.35, -0.032)
    s.quadraticCurveTo(0.06, -0.05, 0, 0)
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.005, bevelEnabled: true,
      bevelThickness: 0.003, bevelSize: 0.002, bevelSegments: 2,
    })
    g.center()
    return g
  }, [])
  return <mesh geometry={geo} material={material} />
}

/* ── Tractor Propeller ── */
function TractorProp({ spinning, material }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current && spinning) ref.current.rotation.z += dt * 30
  })
  return (
    <group ref={ref}>
      <Blade material={material} />
      <group rotation={[0, 0, Math.PI]}><Blade material={material} /></group>
    </group>
  )
}

/* ── Wing Half with winglet + dark panels ── */
function WingHalf({ side, bodyMat, panelMat, accentMat, ledMat, glow = 0 }) {
  const span = 0.95
  const rootChord = 0.22
  const tipChord = 0.11

  const geo = useMemo(() => {
    const sh = new THREE.Shape()
    const s = side
    // X is span, Y is chord (+Y is forward)
    sh.moveTo(0, rootChord * 0.5) // Root leading edge
    sh.lineTo(span * s, tipChord * 0.35) // Tip leading edge
    sh.quadraticCurveTo(span * s * 1.008, -tipChord * 0.05, span * s, -tipChord * 0.5) // Tip trailing
    sh.lineTo(0, -rootChord * 0.5) // Root trailing
    sh.lineTo(0, rootChord * 0.5) // Close

    const g = new THREE.ExtrudeGeometry(sh, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.007,
      bevelSize: 0.005,
      bevelSegments: 4,
    })
    // Center thickness (Z), leave X and Y relative to root
    g.translate(0, 0, -0.01)
    return g
  }, [side])

  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#e0e0d8', metalness: 0.05, roughness: 0.32,
    clearcoat: 0.6, clearcoatRoughness: 0.18,
    emissive: '#34D399', emissiveIntensity: glow * 0.25,
  }), [glow])

  return (
    <group>
      {/* Wing surface */}
      <mesh geometry={geo} material={mat} rotation={[Math.PI / 2, 0, 0]} />

      {/* Dark solar/carbon panel strip on top */}
      <mesh position={[span * 0.6 * side, 0.012, -0.01]}>
        <boxGeometry args={[span * 0.6, 0.004, 0.08]} />
        <primitive object={panelMat} attach="material" />
      </mesh>

      {/* Upturned winglet */}
      <group position={[span * 0.98 * side, 0.035, -0.01]}>
        {/* Winglet vertical surface */}
        <mesh>
          <boxGeometry args={[0.008, 0.07, tipChord * 0.8]} />
          <meshPhysicalMaterial
            color="#dcdcd5" metalness={0.05} roughness={0.32}
            clearcoat={0.5} clearcoatRoughness={0.2}
          />
        </mesh>
        {/* Winglet tip accent */}
        <mesh position={[0, 0.036, 0]}>
          <boxGeometry args={[0.006, 0.004, tipChord * 0.8]} />
          <primitive object={accentMat} attach="material" />
        </mesh>
      </group>

      {/* Nav light at wingtip */}
      <mesh position={[span * 0.99 * side, 0, tipChord * 0.3]}>
        <sphereGeometry args={[0.006, 10, 10]} />
        <primitive object={ledMat} attach="material" />
      </mesh>

      {/* Leading-edge accent strip */}
      <mesh position={[span * 0.45 * side, 0.012, rootChord * 0.3]}>
        <boxGeometry args={[span * 0.8, 0.003, 0.003]} />
        <primitive object={accentMat} attach="material" />
      </mesh>
    </group>
  )
}

/* ════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════ */
export default function DroneModel({ disassemble = 0, highlightPart = null, landed = false }) {
  const groupRef = useRef()
  const m = useMats()
  const fuselageGeo = useFuselageGeo()

  useFrame((state) => {
    if (!groupRef.current || landed) return
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.08
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.015
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.008
  })

  const d = disassemble
  const wingOff = d * 2.0
  const tailOff = d * 2.5
  const propOff = d * 2.2
  const batOff = d * 1.5
  const frameOff = d * 0.5
  const glow = (part) => highlightPart === part ? 0.8 : 0

  return (
    <group ref={groupRef} scale={1.6} rotation={[0.1, -Math.PI / 5, 0.05]}>

      {/* ══════ FUSELAGE ══════ */}
      <group position={[0, frameOff * 0.2, 0]}>
        {/* Pod body (off-white) */}
        <mesh geometry={fuselageGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial
            color="#e8e8e0" metalness={0.05} roughness={0.28}
            clearcoat={0.7} clearcoatRoughness={0.15}
            emissive="#34D399" emissiveIntensity={glow('frame') * 0.15}
          />
        </mesh>

        {/* Dark canopy - slopes from nose up to wing root */}
        <group position={[0, 0.055, 0.22]}>
          {/* Main canopy dome */}
          <mesh rotation={[0.25, 0, 0]}>
            <sphereGeometry args={[0.072, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <primitive object={m.canopy} attach="material" />
          </mesh>
          {/* Canopy rear slope extension */}
          <mesh position={[0, 0.01, -0.08]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.1, 0.03, 0.12]} />
            <primitive object={m.canopy} attach="material" />
          </mesh>
          {/* Canopy frame accent */}
          <mesh rotation={[Math.PI / 2 + 0.25, 0, 0]} position={[0, -0.003, 0]}>
            <torusGeometry args={[0.07, 0.002, 8, 28]} />
            <primitive object={m.accent} attach="material" />
          </mesh>
        </group>

        {/* Fuselage dorsal accent stripe */}
        <mesh position={[0, 0.082, -0.1]}>
          <boxGeometry args={[0.003, 0.003, 0.35]} />
          <primitive object={m.accent} attach="material" />
        </mesh>

        {/* Side accent stripes */}
        {[1, -1].map((s) => (
          <mesh key={`ss${s}`} position={[0.07 * s, 0.01, -0.02]}>
            <boxGeometry args={[0.002, 0.002, 0.5]} />
            <primitive object={m.accent} attach="material" />
          </mesh>
        ))}

        {/* Ventral sensor pod */}
        <group position={[0, -0.075, 0.13]}>
          <mesh>
            <sphereGeometry args={[0.025, 14, 10]} />
            <primitive object={m.canopy} attach="material" />
          </mesh>
          <mesh position={[0, -0.01, 0.018]} rotation={[0.4, 0, 0]}>
            <circleGeometry args={[0.012, 12]} />
            <meshPhysicalMaterial color="#1a3a2a" metalness={0.1} roughness={0.05}
              transparent opacity={0.5} clearcoat={1} />
          </mesh>
        </group>

        {/* ── Tail-dragger landing gear ── */}
        {/* Main wheels (under front of wings) */}
        {[-0.06, 0.06].map((x, i) => (
          <group key={`mw${i}`} position={[x, -0.09, 0.06]}>
            {/* Strut */}
            <mesh>
              <cylinderGeometry args={[0.005, 0.004, 0.06, 8]} />
              <primitive object={m.gear} attach="material" />
            </mesh>
            {/* Wheel */}
            <mesh position={[0, -0.032, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.018, 0.007, 8, 18]} />
              <primitive object={m.wheel} attach="material" />
            </mesh>
            {/* Wheel hub */}
            <mesh position={[0, -0.032, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.006, 10]} />
              <primitive object={m.gear} attach="material" />
            </mesh>
          </group>
        ))}
        {/* Tail wheel */}
        <group position={[0, -0.048, -0.38]}>
          <mesh>
            <cylinderGeometry args={[0.003, 0.002, 0.03, 6]} />
            <primitive object={m.gear} attach="material" />
          </mesh>
          <mesh position={[0, -0.017, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.008, 0.004, 6, 12]} />
            <primitive object={m.wheel} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ══════ HIGH-MOUNTED WINGS ══════ */}
      <group position={[wingOff * 0.6, 0.08 + wingOff * 0.3, 0.03]}>
        <WingHalf side={1} bodyMat={m.wing} panelMat={m.darkPanel}
          accentMat={m.accent} ledMat={m.ledG} glow={glow('propellers')} />
      </group>
      <group position={[-wingOff * 0.6, 0.08 + wingOff * 0.3, 0.03]}>
        <WingHalf side={-1} bodyMat={m.wing} panelMat={m.darkPanel}
          accentMat={m.accent} ledMat={m.ledR} glow={glow('propellers')} />
      </group>

      {/* ══════ CONVENTIONAL TAIL ══════ */}
      <group position={[0, tailOff * 0.15, -tailOff * 0.5]}>
        {/* Horizontal stabilizers (2) */}
        <mesh position={[0, 0.02, -0.44]}>
          <boxGeometry args={[0.4, 0.007, 0.06]} />
          <meshPhysicalMaterial
            color="#dcdcd5" metalness={0.05} roughness={0.32}
            clearcoat={0.5} emissive="#38BDF8"
            emissiveIntensity={glow('motors')}
          />
        </mesh>
        {/* H-stab tips */}
        {[-0.2, 0.2].map((x, i) => (
          <mesh key={`ht${i}`} position={[x, 0.02, -0.44]}>
            <boxGeometry args={[0.012, 0.005, 0.045]} />
            <primitive object={m.gold} attach="material" />
          </mesh>
        ))}

        {/* Vertical fin - tall */}
        <mesh position={[0, 0.115, -0.44]}>
          <boxGeometry args={[0.007, 0.19, 0.07]} />
          <meshPhysicalMaterial
            color="#dcdcd5" metalness={0.05} roughness={0.32}
            clearcoat={0.5} emissive="#38BDF8"
            emissiveIntensity={glow('motors') * 0.5}
          />
        </mesh>
        {/* Fin dark leading edge */}
        <mesh position={[0, 0.115, -0.402]}>
          <boxGeometry args={[0.006, 0.17, 0.012]} />
          <primitive object={m.finDark} attach="material" />
        </mesh>
        {/* Fin top accent */}
        <mesh position={[0, 0.21, -0.44]}>
          <boxGeometry args={[0.005, 0.008, 0.055]} />
          <primitive object={m.gold} attach="material" />
        </mesh>
        {/* Tail beacon */}
        <mesh position={[0, 0.215, -0.44]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <primitive object={m.ledR} attach="material" />
        </mesh>
        {/* H-stab LED strip */}
        <mesh position={[0, 0.02, -0.472]}>
          <boxGeometry args={[0.3, 0.002, 0.002]} />
          <primitive object={m.accent} attach="material" />
        </mesh>
      </group>

      {/* ══════ TRACTOR PROPELLER (nose tip) ══════ */}
      <group position={[0, propOff * 0.25, 0.56 + propOff * 0.5]}>
        {/* Spinner cone */}
        <mesh position={[0, 0, 0.015]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.018, 0.045, 14]} />
          <primitive object={m.spinner} attach="material" />
        </mesh>
        {/* Motor backplate */}
        <mesh position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.022, 0.012, 14]} />
          <primitive object={m.spinner} attach="material" />
        </mesh>
        {/* Prop accent ring */}
        <mesh position={[0, 0, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.019, 0.002, 8, 16]} />
          <primitive object={m.accent} attach="material" />
        </mesh>
        {/* 2-blade prop */}
        <group position={[0, 0, 0.02]}>
          <TractorProp spinning={d < 0.3} material={m.prop} />
        </group>
      </group>

      {/* ══════ BATTERY ══════ */}
      <group position={[0, -0.04 - batOff, 0.05]}>
        <mesh>
          <boxGeometry args={[0.05, 0.025, 0.1]} />
          <meshPhysicalMaterial
            color="#1a2420" metalness={0.3} roughness={0.5}
            clearcoat={0.2} emissive="#34D399"
            emissiveIntensity={glow('battery')}
          />
        </mesh>
        <mesh position={[0, 0.014, 0]}>
          <boxGeometry args={[0.03, 0.002, 0.06]} />
          <primitive object={m.battLabel} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <boxGeometry args={[0.015, 0.012, 0.01]} />
          <primitive object={m.gold} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
