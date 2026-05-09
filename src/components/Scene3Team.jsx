import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getTeam } from '../api'

gsap.registerPlugin(ScrollTrigger)

const API_URL = import.meta.env.VITE_API_URL || ''

const DEFAULT_TEAM = [
  { name: 'Ahmed Hassan', role: 'Team Lead', roleClass: 'role-lead', initials: 'AH', description: 'Oversees all operations and competition strategy' },
  { name: 'Sarah Chen', role: 'Mechanical', roleClass: 'role-mechanical', initials: 'SC', description: 'Frame design and aerodynamics optimization' },
  { name: 'Omar Khalil', role: 'Electrical', roleClass: 'role-electrical', initials: 'OK', description: 'Power systems and flight controller integration' },
  { name: 'Lina Park', role: 'Software', roleClass: 'role-software', initials: 'LP', description: 'Autonomous flight algorithms and CV' },
  { name: 'Yusuf Abdi', role: 'Mechanical', roleClass: 'role-mechanical', initials: 'YA', description: '3D printing and rapid prototyping lead' },
  { name: 'Maya Torres', role: 'Electrical', roleClass: 'role-electrical', initials: 'MT', description: 'ESC tuning and motor optimization specialist' },
  { name: 'Daniel Okafor', role: 'Software', roleClass: 'role-software', initials: 'DO', description: 'Ground station and telemetry systems' },
  { name: 'Fatima Al-Rashid', role: 'Lead', roleClass: 'role-lead', initials: 'FA', description: 'Competition pilot and team coordinator' },
]

export default function Scene3Team() {
  const sectionRef = useRef()
  const cardsRef = useRef([])
  const [team, setTeam] = useState(DEFAULT_TEAM)

  useEffect(() => {
    getTeam().then(data => { if (data) setTeam(data) }).catch(() => {})
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('.team-title')
      if (title) {
        gsap.fromTo(title, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      }
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card, { opacity: 0, y: 60, scale: 0.85 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [team])

  return (
    <section id="team" ref={sectionRef} style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '8rem 2rem 4rem' }}>
      <div className="team-title" style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
        <div className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', marginBottom: '1rem', textTransform: 'uppercase' }}>// The Team</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
          <span className="gradient-text">Meet the</span>{' '}<span style={{ color: '#f8fafc' }}>Engineers</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
          A multidisciplinary team of passionate engineers united by the dream of flight.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {team.map((member, i) => (
          <div key={member._id || member.name} ref={(el) => (cardsRef.current[i] = el)} className="team-card" style={{ opacity: 0, textAlign: 'center' }}>
            {/* Avatar or Photo */}
            {member.photo
              ? <img src={`${API_URL}${member.photo}`} alt={member.name} className="team-avatar"
                  style={{ objectFit: 'cover', padding: 0, fontSize: 0 }} />
              : <div className="team-avatar">{member.initials}</div>
            }
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>{member.name}</h3>
            <span className={`role-badge ${member.roleClass}`}>{member.role}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>{member.description}</p>
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#C9A87C', textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
