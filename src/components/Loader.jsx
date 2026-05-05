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
      className="loader-container"
      style={{
        opacity: progress >= 100 ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: progress >= 100 ? 'none' : 'all',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 168, 124, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

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

      {/* Progress bar */}
      <div
        style={{
          width: '200px',
          height: '2px',
          background: 'rgba(201, 168, 124, 0.12)',
          borderRadius: '1px',
          marginTop: '1.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #C9A87C, #D4A843)',
            borderRadius: '1px',
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>

      {/* Progress percentage */}
      <div
        className="font-mono"
        style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.75rem',
          letterSpacing: '0.1em',
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  )
}
