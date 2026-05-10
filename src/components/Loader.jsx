import { useState, useEffect } from 'react'

/**
 * Loader - Premium loading screen with animated rings, logo, and progress
 * Displays while the 3D scene and assets are loading
 */
export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress with easing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        // Accelerate as we get closer
        const increment = prev < 60 ? 2 : prev < 90 ? 1.5 : 0.8
        return Math.min(prev + increment, 100)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      className="loader-container stars-bg bg-grid"
      style={{
        opacity: progress >= 100 ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: progress >= 100 ? 'none' : 'all',
        background: 'radial-gradient(circle at 50% 50%, #151821 0%, #07080C 80%)',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '15%', left: '15%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(201, 168, 124, 0.08) 0%, transparent 60%)',
          filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%', right: '15%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(74, 158, 191, 0.06) 0%, transparent 60%)',
          filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
        }}
      />

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


      {/* Logo in loader */}
      <img
        src="/logo.png"
        alt="Skyhawks"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(201, 168, 124, 0.4)',
          boxShadow: '0 0 25px rgba(201, 168, 124, 0.3)',
          marginBottom: '1.5rem',
          animation: 'spin 4s linear infinite',
        }}
      />

      {/* Brand name */}
      <h1
        className="font-display"
        style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          letterSpacing: '0.2em',
          marginTop: '0.5rem',
          background: 'linear-gradient(135deg, #C9A87C, #E2C49A, #D4A843)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        SKYHAWKS
      </h1>

      {/* Subtitle */}
      <div
        className="font-mono"
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: '#C9A87C',
          marginTop: '0.3rem',
          textTransform: 'uppercase',
        }}
      >
        Unmanned Aerial Systems
      </div>

      {/* Loading text */}
      <div className="loader-text" style={{ marginTop: '2rem' }}>
        INITIALIZING SYSTEMS
      </div>

      {/* Airplane Progress Bar */}
      <div
        style={{
          position: 'relative',
          width: '260px',
          height: '40px',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Track line (optional subtle background) */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'rgba(201,168,124,0.1)', transform: 'translateY(-50%)' }} />

        {/* Clouds trail */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: `${progress}%`,
            height: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '4px', paddingLeft: '4px', marginLeft: '-15px' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} style={{ fontSize: '1.1rem', opacity: Math.random() * 0.4 + 0.4, transform: `scale(${Math.random() * 0.5 + 0.7})` }}>☁️</span>
            ))}
          </div>
        </div>

        {/* The airplane */}
        <div
          style={{
            position: 'absolute',
            left: `${progress}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '1.8rem',
            filter: 'drop-shadow(0 0 12px rgba(201, 168, 124, 0.6))',
            zIndex: 2,
          }}
        >
          ✈️
        </div>
      </div>

      {/* Progress percentage */}
      <div
        className="font-mono"
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-primary-bright)',
          marginTop: '1rem',
          letterSpacing: '0.15em',
          textShadow: '0 0 10px rgba(201, 168, 124, 0.4)'
        }}
      >
        {Math.round(progress)}%
      </div>
      </div>
    </div>
  )
}
