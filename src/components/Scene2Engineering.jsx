import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getEngineering, getUAVs } from '../api'

gsap.registerPlugin(ScrollTrigger)

// ─── DEFAULTS ────────────────────────────────────────────────────────────────
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

const STATUS_CONFIG = {
  'Active':            { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', dot: '#4ade80', label: '● Active' },
  'Retired':           { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', dot: '#f87171', label: '● Retired' },
  'Under Development': { color: '#D4A843', bg: 'rgba(212,168,67,0.12)',  border: 'rgba(212,168,67,0.35)',  dot: '#D4A843', label: '◐ In Development' },
}

// ─── GALLERY MODAL ───────────────────────────────────────────────────────────
function GalleryModal({ uav, onClose }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const images = uav?.gallery?.length ? uav.gallery : []

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        animation: 'uav-fadeIn 0.25s ease',
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--color-accent)', letterSpacing: '0.2em', marginBottom: '0.3rem' }}>// GALLERY</div>
          <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #C9A87C, #E2C49A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {uav?.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >✕</button>
      </div>

      {/* Lightbox enlarged image */}
      {active !== null && (
        <div onClick={() => setActive(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={images[active]} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 60px rgba(201,168,124,0.3)' }} />
          <button onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }} style={arrowStyle('left')}>‹</button>
          <button onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }} style={arrowStyle('right')}>›</button>
        </div>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
          <p>No gallery images yet.</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {images.map((src, idx) => (
            <div key={idx} onClick={() => setActive(idx)} style={{ aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', cursor: 'zoom-in', border: '1px solid var(--color-border)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,124,0.5)'; e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'scale(1)' }}>
              <img src={src} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function arrowStyle(side) {
  return {
    position: 'fixed', top: '50%', transform: 'translateY(-50%)',
    [side]: '1.5rem',
    background: 'rgba(201,168,124,0.2)', border: '1px solid rgba(201,168,124,0.4)',
    borderRadius: '50%', width: '48px', height: '48px',
    color: '#C9A87C', fontSize: '1.8rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Scene2Engineering({ onHighlight }) {
  const sectionRef  = useRef()
  const cardsRef    = useRef([])
  const carouselRef = useRef()
  const cardRef     = useRef()

  const [specs, setSpecs]       = useState(DEFAULT_SPECS)
  const [stats, setStats]       = useState(DEFAULT_STATS)
  const [uavs,  setUAVs]        = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)   // 1 = forward, -1 = backward
  const [animating, setAnimating] = useState(false)
  const [galleryUAV, setGalleryUAV] = useState(null)

  // ── Data fetch ──
  useEffect(() => {
    getEngineering()
      .then(({ specs: s, stats: st }) => {
        if (s  && !s.error)  setSpecs(s)
        if (st && !st.error) setStats(st)
        setTimeout(() => ScrollTrigger.refresh(), 100)
      })
      .catch(err => console.error('Engineering fetch:', err))

    getUAVs()
      .then(data => { if (Array.isArray(data)) setUAVs(data) })
      .catch(err => console.error('UAVs fetch:', err))
  }, [])

  // ── Specs cards scroll animation ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? -80 : 80, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 40%', toggleActions: 'play none none reverse' } }
        )
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

  // ── Carousel navigation ──
  const navigate = useCallback((dir) => {
    if (animating || uavs.length <= 1) return
    setAnimating(true)
    setDirection(dir)

    const card = cardRef.current
    if (!card) { setAnimating(false); return }

    gsap.to(card, {
      opacity: 0, x: dir * -60, scale: 0.95, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        setActiveIdx(prev => (prev + dir + uavs.length) % uavs.length)
        gsap.fromTo(card,
          { opacity: 0, x: dir * 60, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'power3.out',
            onComplete: () => setAnimating(false) }
        )
      }
    })
  }, [animating, uavs.length])

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const currentUAV = uavs[activeIdx]
  const statusCfg  = currentUAV ? (STATUS_CONFIG[currentUAV.status] || STATUS_CONFIG['Active']) : null

  return (
    <section
      id="engineering"
      ref={sectionRef}
      style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '8rem 2rem 6rem' }}
    >
      {/* ── Section heading ── */}
      <div className="section-heading" style={{ textAlign: 'center', marginBottom: '4rem', opacity: 0 }}>
        <div className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', marginBottom: '1rem', textTransform: 'uppercase' }}>// Our Fleet</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem' }}>
          <span className="gradient-text">OUR</span>{' '}<span className="gradient-text-gold">UAVs</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', maxWidth: '580px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
          Every aircraft tells a story — engineered for competition, built to dominate the skies.
        </p>
      </div>

      {/* ── Fleet Carousel ── */}
      <div ref={carouselRef} style={{ maxWidth: '1100px', margin: '0 auto 6rem', position: 'relative' }}>

        {uavs.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(20,16,10,0.5)', border: '1px dashed var(--color-border)', borderRadius: '20px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✈️</div>
            <h3 className="font-display" style={{ fontSize: '1.3rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>No UAVs yet</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Add your first aircraft from the admin panel.</p>
          </div>
        ) : (
          <>
            {/* Background glow text */}
            <div aria-hidden style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 900,
              color: 'transparent', WebkitTextStroke: '1px rgba(201,168,124,0.06)',
              whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.05em',
              transition: 'opacity 0.4s',
            }}>
              {currentUAV?.name?.toUpperCase()}
            </div>

            {/* Navigation arrows */}
            {uavs.length > 1 && (
              <>
                <button
                  id="uav-prev-btn"
                  className="uav-nav-arrow uav-nav-arrow-left"
                  onClick={() => navigate(-1)}
                  aria-label="Previous UAV"
                  disabled={animating}
                >‹</button>
                <button
                  id="uav-next-btn"
                  className="uav-nav-arrow uav-nav-arrow-right"
                  onClick={() => navigate(1)}
                  aria-label="Next UAV"
                  disabled={animating}
                >›</button>
              </>
            )}

            {/* Main card */}
            <div ref={cardRef} className="uav-fleet-card">
              <div className="uav-fleet-inner">

                {/* Left: image */}
                <div className="uav-image-col">
                  {currentUAV?.image ? (
                    <div className="uav-image-wrap">
                      <img
                        src={currentUAV.image}
                        alt={currentUAV.name}
                        className="uav-main-image"
                      />
                      <div className="uav-image-glow" />
                    </div>
                  ) : (
                    <div className="uav-image-placeholder">
                      <span style={{ fontSize: '5rem' }}>✈️</span>
                    </div>
                  )}

                  {/* Dot indicators */}
                  {uavs.length > 1 && (
                    <div className="uav-dots">
                      {uavs.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (i !== activeIdx && !animating) {
                              const d = i > activeIdx ? 1 : -1
                              setDirection(d)
                              const card = cardRef.current
                              if (!card) return
                              setAnimating(true)
                              gsap.to(card, {
                                opacity: 0, x: d * -60, scale: 0.95, duration: 0.3, ease: 'power2.in',
                                onComplete: () => {
                                  setActiveIdx(i)
                                  gsap.fromTo(card, { opacity: 0, x: d * 60, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'power3.out', onComplete: () => setAnimating(false) })
                                }
                              })
                            }
                          }}
                          className={`uav-dot ${i === activeIdx ? 'uav-dot-active' : ''}`}
                          aria-label={`Go to UAV ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: details */}
                <div className="uav-details-col">
                  {/* Status badge */}
                  {statusCfg && (
                    <div className="uav-status-badge" style={{ color: statusCfg.color, background: statusCfg.bg, border: `1px solid ${statusCfg.border}` }}>
                      {statusCfg.label}
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="font-display uav-name">{currentUAV?.name}</h3>

                  {/* Divider */}
                  <div style={{ width: '50px', height: '2px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', borderRadius: '2px', margin: '1rem 0', boxShadow: '0 0 10px rgba(201,168,124,0.4)' }} />

                  {/* Description */}
                  {currentUAV?.description && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                      {currentUAV.description}
                    </p>
                  )}

                  {/* Competition */}
                  {currentUAV?.competition && (
                    <div className="uav-info-row">
                      <div className="uav-info-icon">🏆</div>
                      <div>
                        <div className="uav-info-label">Competition</div>
                        <div className="uav-info-value">{currentUAV.competition}</div>
                        {currentUAV.competitionDate && (
                          <div className="uav-info-date">{currentUAV.competitionDate}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {currentUAV?.achievements && (
                    <div className="uav-info-row">
                      <div className="uav-info-icon">🥇</div>
                      <div>
                        <div className="uav-info-label">Achievements</div>
                        <div className="uav-info-value">{currentUAV.achievements}</div>
                      </div>
                    </div>
                  )}

                  {/* Gallery button */}
                  <button
                    id="uav-gallery-btn"
                    className="uav-gallery-btn"
                    onClick={() => setGalleryUAV(currentUAV)}
                  >
                    <span>📷</span>
                    <span>View Gallery</span>
                    {currentUAV?.gallery?.length > 0 && (
                      <span className="uav-gallery-count">{currentUAV.gallery.length}</span>
                    )}
                  </button>

                  {/* UAV counter */}
                  {uavs.length > 1 && (
                    <div className="font-mono" style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.15em' }}>
                      {String(activeIdx + 1).padStart(2, '0')} / {String(uavs.length).padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Engineering Specs (kept below) ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: 'var(--color-accent)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>// Engineering Breakdown</div>
          <h3 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800 }}>
            <span className="gradient-text">Built to</span>{' '}<span className="gradient-text-gold">Dominate</span>
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '2rem' }}>
          {specs.map((spec, i) => (
            <div
              key={spec._id || spec.part}
              ref={(el) => (cardsRef.current[i] = el)}
              className="spec-panel glass-card-hover"
              style={{ opacity: 0, cursor: 'pointer' }}
              onMouseEnter={() => onHighlight?.(spec.part)}
              onMouseLeave={() => onHighlight?.(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201,168,124,0.12)', border: '1px solid rgba(201,168,124,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{spec.icon}</div>
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
      </div>

      {/* ── Stats row ── */}
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '1.5rem' }}
        ref={(el) => { if (el) gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } }) }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}>{stat.value}</div>
            <div className="spec-label" style={{ marginTop: '0.5rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Gallery Modal ── */}
      {galleryUAV && <GalleryModal uav={galleryUAV} onClose={() => setGalleryUAV(null)} />}
    </section>
  )
}
