import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scene4Achievements - Timeline of achievements and awards
 * Features animated timeline with alternating cards
 */

const achievements = [
  {
    year: '2024',
    title: 'International Drone Racing Championship',
    description: '1st Place — Autonomous category. Fastest lap time of 42.3 seconds.',
    award: '🥇 Gold Medal',
    color: '#C47A52',
  },
  {
    year: '2024',
    title: 'IEEE Robotics Competition',
    description: 'Best Innovation Award for our custom flight controller design.',
    award: '🏆 Innovation Award',
    color: '#C9A87C',
  },
  {
    year: '2023',
    title: 'National STEM Expo',
    description: 'Featured project, showcasing autonomous delivery drone prototype.',
    award: '⭐ Featured Project',
    color: '#D4A843',
  },
  {
    year: '2023',
    title: 'SAE Aero Design',
    description: '2nd Place overall. Highest payload-to-weight ratio in competition history.',
    award: '🥈 Silver Medal',
    color: '#4A9EBF',
  },
  {
    year: '2022',
    title: 'University Innovation Grant',
    description: 'Awarded $25,000 for autonomous drone research and development.',
    award: '💰 Research Grant',
    color: '#C47A52',
  },
  {
    year: '2022',
    title: 'Regional Drone Freestyle',
    description: '3rd Place — Team freestyle. Crowd-voted fan favorite performance.',
    award: '🥉 Bronze + Fan Favorite',
    color: '#C9A87C',
  },
]

export default function Scene4Achievements() {
  const sectionRef = useRef()
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      const title = sectionRef.current?.querySelector('.ach-title')
      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Stagger card animations
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: i % 2 === 0 ? -100 : 100,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="achievements"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 2,
        padding: '8rem 2rem 4rem',
      }}
    >
      {/* Section Header */}
      <div className="ach-title" style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
        <div
          className="font-mono"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'var(--color-accent)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}
        >
          // Achievements
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
          }}
        >
          <span className="gradient-text-orange">Track Record</span>{' '}
          <span style={{ color: '#f8fafc' }}>of Excellence</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
      </div>

      {/* Timeline */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Timeline center line */}
        <div
          className="timeline-line"
          style={{ display: 'none' }}
        />

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {achievements.map((ach, i) => (
            <div
              key={`${ach.year}-${ach.title}`}
              ref={(el) => (cardsRef.current[i] = el)}
              className="achievement-card"
              style={{
                opacity: 0,
                maxWidth: '800px',
                margin: i % 2 === 0 ? '0 auto 0 0' : '0 0 0 auto',
              }}
            >
              {/* Color accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: ach.color,
                  borderRadius: '4px 0 0 4px',
                  boxShadow: `0 0 15px ${ach.color}60`,
                }}
              />

              <div style={{ paddingLeft: '1rem' }}>
                {/* Year + Award row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span className="achievement-year">{ach.year}</span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: ach.color,
                      fontWeight: 600,
                    }}
                  >
                    {ach.award}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-display"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    marginBottom: '0.5rem',
                  }}
                >
                  {ach.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
