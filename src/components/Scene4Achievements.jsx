import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getAchievements } from '../api'

gsap.registerPlugin(ScrollTrigger)

const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : ''

const DEFAULT = [
  { year: '2024', title: 'International Drone Racing Championship', description: '1st Place — Autonomous category. Fastest lap time of 42.3 seconds.', award: '🥇 Gold Medal', color: '#C47A52' },
  { year: '2024', title: 'IEEE Robotics Competition', description: 'Best Innovation Award for our custom flight controller design.', award: '🏆 Innovation Award', color: '#C9A87C' },
  { year: '2023', title: 'National STEM Expo', description: 'Featured project, showcasing autonomous delivery drone prototype.', award: '⭐ Featured Project', color: '#D4A843' },
  { year: '2023', title: 'SAE Aero Design', description: '2nd Place overall. Highest payload-to-weight ratio in competition history.', award: '🥈 Silver Medal', color: '#4A9EBF' },
  { year: '2022', title: 'University Innovation Grant', description: 'Awarded $25,000 for autonomous drone research and development.', award: '💰 Research Grant', color: '#C47A52' },
  { year: '2022', title: 'Regional Drone Freestyle', description: '3rd Place — Team freestyle. Crowd-voted fan favorite performance.', award: '🥉 Bronze + Fan Favorite', color: '#C9A87C' },
]

export default function Scene4Achievements() {
  const sectionRef = useRef()
  const cardsRef = useRef([])
  const [achievements, setAchievements] = useState(DEFAULT)
  const [modal, setModal] = useState(null) // { ach }
  const [currentImgIdx, setCurrentImgIdx] = useState(0)

  useEffect(() => {
    getAchievements().then(data => { 
      if (data && !data.error) setAchievements(data) 
    }).catch(err => console.error("Frontend Fetch Error (Achievements):", err))
  }, [])

  useEffect(() => {
    // Small delay to let layout settle (important on mobile)
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const title = sectionRef.current?.querySelector('.ach-title')
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
        cardsRef.current.forEach((card, i) => {
          if (!card) return
          gsap.fromTo(card, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            delay: i * 0.05,
            scrollTrigger: {
              trigger: card,
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
  }, [achievements])

  return (
    <section id="achievements" ref={sectionRef} style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '8rem 2rem 4rem' }}>
      <div className="ach-title" style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="font-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--color-accent)', marginBottom: '1rem', textTransform: 'uppercase' }}>// Achievements</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
          <span className="gradient-text-orange">Track Record</span>{' '}<span style={{ color: '#f8fafc' }}>of Excellence</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {achievements.map((ach, i) => (
            <div key={ach._id || ach.title} ref={(el) => (cardsRef.current[i] = el)} className="achievement-card"
              style={{ maxWidth: '800px', margin: i % 2 === 0 ? '0 auto 0 0' : '0 0 0 auto' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: ach.color, borderRadius: '4px 0 0 4px', boxShadow: `0 0 15px ${ach.color}60` }} />
              <div style={{ paddingLeft: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="achievement-year">{ach.year}</span>
                  <span style={{ fontSize: '0.8rem', color: ach.color, fontWeight: 600 }}>{ach.award}</span>
                </div>
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>{ach.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{ach.description}</p>
                {ach.images && ach.images.length > 0 && (
                  <button onClick={() => { setModal(ach); setCurrentImgIdx(0); }}
                    style={{ marginTop: '1rem', padding: '0.4rem 1rem', background: 'rgba(201,168,124,0.12)', border: '1px solid rgba(201,168,124,0.35)', borderRadius: '8px', color: '#C9A87C', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.05em' }}>
                    More Information
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#1a1a2e', border: '1px solid rgba(201,168,124,0.3)', borderRadius: '16px', padding: '2rem', maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}>{modal.title}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>
            
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {modal.images && modal.images.length > 0 ? (
                <>
                  <img src={modal.images[currentImgIdx].startsWith('data:') || modal.images[currentImgIdx].startsWith('http') ? modal.images[currentImgIdx] : `${API_URL}${modal.images[currentImgIdx]}`} alt={`Achievement ${currentImgIdx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  
                  {modal.images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev > 0 ? prev - 1 : modal.images.length - 1)) }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>‹</button>
                      <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev < modal.images.length - 1 ? prev + 1 : 0)) }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>›</button>
                      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem' }}>{currentImgIdx + 1} / {modal.images.length}</div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ color: '#9ca3af' }}>No images available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
