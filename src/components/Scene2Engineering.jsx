import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getEngineering } from '../api'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_SPECS = [
  { part: 'propellers', icon: '✈️', title: 'Wings', description: 'High-aspect ratio composite wings', details: [{ label: 'Material', value: 'Carbon Fiber' }, { label: 'Span', value: '2.4m' }, { label: 'Airfoil', value: 'NACA 2412' }, { label: 'Config', value: 'Swept' }] },
  { part: 'motors', icon: '🔧', title: 'Tail Assembly', description: 'Precision-engineered empennage', details: [{ label: 'Type', value: 'T-Tail' }, { label: 'Servo', value: 'Digital' }, { label: 'Material', value: 'Balsa/CF' }, { label: 'Deflection', value: '±30°' }] },
  { part: 'frame', icon: '🛡️', title: 'Fuselage', description: 'Aerodynamic monocoque fuselage', details: [{ label: 'Material', value: '3K Carbon' }, { label: 'Weight', value: '850g' }, { label: 'Length', value: '1.2m' }, { label: 'Payload', value: '2kg max' }] },
  { part: 'battery', icon: '🔋', title: 'Power System', description: 'High-efficiency pusher propulsion', details: [{ label: 'Motor', value: 'Brushless' }, { label: 'Battery', value: '4S 5200mAh' }, { label: 'Endurance', value: '45 min' }, { label: 'Propeller', value: '12×6 APC' }] },
]
const DEFAULT_STATS = [
  { value: '3.5 kg', label: 'Total Weight', color: '#C9A87C' },
  { value: '120 km/h', label: 'Cruise Speed', color: '#4A9EBF' },
  { value: '45 min', label: 'Endurance', color: '#D4A843' },
  { value: '2 km', label: 'Range', color: '#C47A52' },
]

export default function Scene2Engineering({ onHighlight }) {
  const sectionRef = useRef()
  const cardsRef = useRef([])
  const [specs, setSpecs] = useState(DEFAULT_SPECS)
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    getEngineering()
      .then(({ specs: s, stats: st }) => {
        if (s && !s.error) setSpecs(s)
        if (st && !st.error) setStats(st)
      })
      .catch(err => console.error("Frontend Fetch Error (Engineering):", err))
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card, { opacity: 0, x: i % 2 === 0 ? -80 : 80, scale: 0.9 }, {
          opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 40%', toggleActions: 'play none none reverse' },
        })
      })
      const title = sectionRef.current?.querySelector('.section-heading')
      if (title) {
        gsap.fromTo(title, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [specs])

  return (
    <section id="engineering" ref={sectionRef} style={{ minHeight: '200vh', position: 'relative', zIndex: 2, padding: '8rem 2rem 4rem' }}>
      <div className="section-heading" style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
        <div className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', marginBottom: '1rem', textTransform: 'uppercase' }}>// Engineering Breakdown</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
          <span className="gradient-text">Built to</span>{' '}<span className="gradient-text-gold">Dominate</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
          Every component is precision-engineered for maximum performance. Scroll to explore each part of our fixed-wing UAV.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {specs.map((spec, i) => (
          <div key={spec._id || spec.part} ref={(el) => (cardsRef.current[i] = el)} className="spec-panel glass-card-hover"
            style={{ opacity: 0, cursor: 'pointer' }} onMouseEnter={() => onHighlight?.(spec.part)} onMouseLeave={() => onHighlight?.(null)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201, 168, 124, 0.12)', border: '1px solid rgba(201, 168, 124, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{spec.icon}</div>
              <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{spec.title}</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{spec.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {spec.details.map((d) => (
                <div key={d.label}>
                  <div className="spec-value" style={{ fontSize: '1.1rem' }}>{d.value}</div>
                  <div className="spec-label">{d.label}</div>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '2px', background: `linear-gradient(90deg, transparent, ${spec.part === 'motors' || spec.part === 'battery' ? '#D4A843' : '#C9A87C'}, transparent)`, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '5rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}
        ref={(el) => { if (el) { gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } }) } }}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}>{stat.value}</div>
            <div className="spec-label" style={{ marginTop: '0.5rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
