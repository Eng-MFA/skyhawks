import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getSponsors } from '../api'

gsap.registerPlugin(ScrollTrigger)

const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : ''

const DEFAULT = [
  { name: 'TechCorp', tier: 'Platinum', color: '#C9A87C', icon: '💎' },
  { name: 'AeroSystems', tier: 'Gold', color: '#D4A843', icon: '✈️' },
  { name: 'PowerCell Labs', tier: 'Gold', color: '#D4A843', icon: '🔋' },
  { name: 'DronePort', tier: 'Silver', color: '#9CA3AF', icon: '🛸' },
  { name: 'QuantumMotors', tier: 'Silver', color: '#9CA3AF', icon: '⚡' },
  { name: 'FPV Vision', tier: 'Silver', color: '#9CA3AF', icon: '📡' },
  { name: 'CarbonTech', tier: 'Bronze', color: '#C47A52', icon: '🔩' },
  { name: 'University R&D', tier: 'Partner', color: '#4A9EBF', icon: '🎓' },
]

export default function Scene5Sponsors() {
  const sectionRef = useRef()
  const logosRef = useRef([])
  logosRef.current = []
  const [sponsors, setSponsors] = useState(DEFAULT)

  useEffect(() => {
    getSponsors().then(data => { 
      if (data && !data.error && data.length > 0) setSponsors(data) 
    }).catch(err => console.error("Frontend Fetch Error (Sponsors):", err))
  }, [])

  useEffect(() => {
    // Small delay to let layout settle (important on mobile)
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const title = sectionRef.current?.querySelector('.sponsors-title')
        if (title) {
          gsap.fromTo(title, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 95%',
              once: true,
            },
          })
        }
        logosRef.current.forEach((logo, i) => {
          if (!logo) return
          gsap.fromTo(logo, { opacity: 0, y: 30, scale: 0.85 }, {
            opacity: 1, y: 0, scale: 1, duration: 0.6, delay: i * 0.06, ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: logo,
              start: 'top 98%',
              once: true,
            },
          })
        })
        ScrollTrigger.refresh()
      }, sectionRef)
      return () => ctx.revert()
    }, 300)
    return () => clearTimeout(timer)
  }, [sponsors])

  return (
    <section id="sponsors" ref={sectionRef} style={{ minHeight: '70vh', position: 'relative', zIndex: 2, padding: '8rem 2rem 4rem' }}>
      <div className="sponsors-title" style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', marginBottom: '1rem', textTransform: 'uppercase' }}>// Partners & Sponsors</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
          <span style={{ color: '#f8fafc' }}>Backed by the</span>{' '}<span className="gradient-text">Best</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
          Our success is made possible by the generous support of our sponsors and partners.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: '1.5rem' }}>
        {sponsors.map((sponsor, i) => (
          <div 
            key={sponsor._id || sponsor.name} 
            ref={(el) => { if(el) logosRef.current[i] = el }} 
            className="sponsor-logo" 
            style={{ flexDirection: 'column', gap: '0.5rem' }}
            onClick={() => sponsor.website ? window.open(sponsor.website, '_blank') : null}
          >
            {sponsor.logo
              ? <img src={sponsor.logo.startsWith('data:') || sponsor.logo.startsWith('http') ? sponsor.logo : `${API_URL}${sponsor.logo}`} alt={sponsor.name} style={{ width: '100%', height: '90px', objectFit: 'contain', marginBottom: '0.5rem' }} />
              : <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{sponsor.icon}</div>
            }
            <div className="font-display" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', textAlign: 'center' }}>{sponsor.name}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sponsor.color, padding: '0.2rem 0.6rem', border: `1px solid ${sponsor.color}40`, borderRadius: '4px' }}>{sponsor.tier}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Interested in sponsoring our team?</p>
        <a href="#contact" className="font-display" style={{ display: 'inline-block', padding: '0.75rem 2rem', border: '1px solid var(--color-primary)', borderRadius: '12px', color: 'var(--color-primary-bright)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', transition: 'all 0.3s ease' }}
          onMouseOver={e => { e.target.style.background = 'rgba(201, 168, 124, 0.1)'; e.target.style.boxShadow = '0 0 25px rgba(201, 168, 124, 0.25)' }}
          onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}>
          BECOME A SPONSOR
        </a>
      </div>
    </section>
  )
}
