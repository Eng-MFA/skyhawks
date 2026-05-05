import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scene3Team - Team members section
 * Animated grid of team member cards with role badges and hover effects
 */

const teamMembers = [
  {
    name: 'Ahmed Hassan',
    role: 'Team Lead',
    roleClass: 'role-lead',
    initials: 'AH',
    description: 'Oversees all operations and competition strategy',
  },
  {
    name: 'Sarah Chen',
    role: 'Mechanical',
    roleClass: 'role-mechanical',
    initials: 'SC',
    description: 'Frame design and aerodynamics optimization',
  },
  {
    name: 'Omar Khalil',
    role: 'Electrical',
    roleClass: 'role-electrical',
    initials: 'OK',
    description: 'Power systems and flight controller integration',
  },
  {
    name: 'Lina Park',
    role: 'Software',
    roleClass: 'role-software',
    initials: 'LP',
    description: 'Autonomous flight algorithms and CV',
  },
  {
    name: 'Yusuf Abdi',
    role: 'Mechanical',
    roleClass: 'role-mechanical',
    initials: 'YA',
    description: '3D printing and rapid prototyping lead',
  },
  {
    name: 'Maya Torres',
    role: 'Electrical',
    roleClass: 'role-electrical',
    initials: 'MT',
    description: 'ESC tuning and motor optimization specialist',
  },
  {
    name: 'Daniel Okafor',
    role: 'Software',
    roleClass: 'role-software',
    initials: 'DO',
    description: 'Ground station and telemetry systems',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Lead',
    roleClass: 'role-lead',
    initials: 'FA',
    description: 'Competition pilot and team coordinator',
  },
]

export default function Scene3Team() {
  const sectionRef = useRef()
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      const title = sectionRef.current?.querySelector('.team-title')
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
          { opacity: 0, y: 60, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
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
      id="team"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 2,
        padding: '8rem 2rem 4rem',
      }}
    >
      {/* Section Header */}
      <div className="team-title" style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
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
          // The Team
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
          }}
        >
          <span className="gradient-text">Meet the</span>{' '}
          <span style={{ color: '#f8fafc' }}>Engineers</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
        <p
          style={{
            marginTop: '1.5rem',
            color: 'var(--color-text-muted)',
            maxWidth: '500px',
            margin: '1.5rem auto 0',
            lineHeight: 1.7,
          }}
        >
          A multidisciplinary team of passionate engineers united by the dream of flight.
        </p>
      </div>

      {/* Team Grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {teamMembers.map((member, i) => (
          <div
            key={member.name}
            ref={(el) => (cardsRef.current[i] = el)}
            className="team-card"
            style={{ opacity: 0, textAlign: 'center' }}
          >
            {/* Avatar */}
            <div className="team-avatar">
              {member.initials}
            </div>

            {/* Name */}
            <h3
              className="font-display"
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#f8fafc',
                marginBottom: '0.5rem',
              }}
            >
              {member.name}
            </h3>

            {/* Role badge */}
            <span className={`role-badge ${member.roleClass}`}>
              {member.role}
            </span>

            {/* Description */}
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.75rem',
                lineHeight: 1.6,
              }}
            >
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
