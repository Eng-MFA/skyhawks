import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

/**
 * Scene1Landing - Hero section with team introduction
 * Features animated text reveal, Skyhawks logo, and scroll indicator
 */
export default function Scene1Landing({ onOpenDisclaimer }) {
  const containerRef = useRef()
  const titleRef = useRef()
  const subtitleRef = useRef()
  const descRef = useRef()
  const scrollRef = useRef()
  const logoRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance animation
      const tl = gsap.timeline({ delay: 1.5 })

      // Logo entrance first
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.5, rotation: -10 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.0, ease: 'back.out(1.7)' }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 60, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, text: "" },
          { 
            opacity: 1, 
            text: "Pushing the boundaries of autonomous flight. We design, build, and fly high-performance fixed-wing UAVs that compete on the world stage. Engineering excellence meets aerial innovation.", 
            duration: 3, 
            ease: 'none' 
          },
          '-=0.4'
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )

      // Logo subtle float animation
      gsap.to(logoRef.current, {
        y: -8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 2.5,
      })

      // Scroll indicator bounce
      gsap.to(scrollRef.current, {
        y: 10,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 3,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="landing"
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        padding: '2rem',
      }}
    >
      {/* Left side content */}
      <div style={{ maxWidth: '650px', marginLeft: '5%' }}>
        {/* Logo */}
        <div
          ref={logoRef}
          style={{
            marginBottom: '2rem',
            opacity: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="Skyhawks - Unmanned Aerial Systems Laboratory"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(201, 168, 124, 0.45)',
              boxShadow: '0 0 30px rgba(201, 168, 124, 0.25), 0 0 60px rgba(201, 168, 124, 0.1)',
            }}
          />
        </div>

        {/* Badge */}
        <div
          ref={subtitleRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(201, 168, 124, 0.1)',
            border: '1px solid rgba(201, 168, 124, 0.25)',
            marginBottom: '1.5rem',
            opacity: 0,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#C9A87C',
              boxShadow: '0 0 12px rgba(201, 168, 124, 0.8)',
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              color: '#E2C49A',
              textTransform: 'uppercase',
            }}
          >
            Unmanned Aerial Systems Laboratory
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            opacity: 0,
          }}
        >
          <span className="gradient-text">SKY</span>
          <span style={{ color: 'var(--color-text-strong)' }}>HAWKS</span>
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: 'var(--color-text)',
            maxWidth: '480px',
            minHeight: '100px',
            opacity: 0,
            textShadow: '0 1px 8px rgba(0,0,0,0.8)',
          }}
        >
        </p>

        {/* Disclaimer Trigger Button */}
        <button
          onClick={() => onOpenDisclaimer && onOpenDisclaimer()}
          style={{
            marginTop: '2rem',
            padding: '0.6rem 1.2rem',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid #ff4444',
            color: '#ff4444',
            borderRadius: '6px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            opacity: 0,
            animation: 'fadeIn 1s forwards 4s' // Fades in after main animations
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
            e.target.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ⚠️ Legal Disclaimer / تنبيه قانوني
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
          }}
        >
          Scroll to explore
        </span>
        <svg
          width="20"
          height="30"
          viewBox="0 0 20 30"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="1.5"
        >
          <rect x="1" y="1" width="18" height="28" rx="9" />
          <circle cx="10" cy="10" r="2" fill="#C9A87C" />
        </svg>
      </div>
    </section>
  )
}
