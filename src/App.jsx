import { useState, useEffect, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Loader from './components/Loader'
import Navbar from './components/Navbar'
import DroneCanvas from './components/DroneCanvas'
import Scene1Landing from './components/Scene1Landing'
import Scene2Engineering from './components/Scene2Engineering'
import Scene3Team from './components/Scene3Team'
import Scene4Achievements from './components/Scene4Achievements'
import Scene5Sponsors from './components/Scene5Sponsors'
import Scene6Contact from './components/Scene6Contact'

gsap.registerPlugin(ScrollTrigger)

/**
 * App - Root component that orchestrates all scenes
 * 
 * Manages:
 * - Loading state
 * - Scroll-based drone disassembly progress (0-1)
 * - Part highlighting state
 * - Drone landing state
 */
export default function App() {
  const [loading, setLoading] = useState(true)
  const [disassemble, setDisassemble] = useState(0)
  const [highlightPart, setHighlightPart] = useState(null)
  const [landed, setLanded] = useState(false)
  const mainRef = useRef()

  // Handle loading complete
  const handleLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  // Handle part highlighting from engineering section
  const handleHighlight = useCallback((part) => {
    setHighlightPart(part)
  }, [])

  // Set up scroll-based drone disassembly
  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      // Drone disassembly tied to engineering section scroll
      ScrollTrigger.create({
        trigger: '#engineering',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          setDisassemble(self.progress)
        },
      })

      // Drone landing tied to contact section
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 50%',
        onEnter: () => setLanded(true),
        onLeaveBack: () => setLanded(false),
      })
    }, mainRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <>
      {/* Loading Screen */}
      {loading && <Loader onComplete={handleLoadComplete} />}

      {/* 3D Canvas (fixed, behind content) */}
      <DroneCanvas
        disassemble={disassemble}
        highlightPart={highlightPart}
        landed={landed}
      />

      {/* Main scrollable content */}
      <main ref={mainRef} className="stars-bg bg-grid">
        <Navbar />

        {/* Scene 1: Landing / Hero */}
        <Scene1Landing />

        {/* Scene 2: Engineering Breakdown */}
        <Scene2Engineering onHighlight={handleHighlight} />

        {/* Scene 3: Team */}
        <Scene3Team />

        {/* Scene 4: Achievements */}
        <Scene4Achievements />

        {/* Scene 5: Sponsors */}
        <Scene5Sponsors />

        {/* Scene 6: Contact */}
        <Scene6Contact />
      </main>
    </>
  )
}
