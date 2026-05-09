import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getContactInfo, submitMessage } from '../api'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scene6Contact - Contact section with form and social links
 * Features animated entrance and glassmorphism form
 */

export default function Scene6Contact() {
  const sectionRef = useRef()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [contactInfo, setContactInfo] = useState({
    email: 'team@skyhawks.edu',
    phone: '+1 (555) 0123-4567',
    location: 'Engineering Building, Room 405',
    instagram: '', twitter: '', youtube: '', linkedin: '',
  })

  useEffect(() => {
    getContactInfo().then(data => { if (data && data.email) setContactInfo(data) }).catch(() => {})
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      const title = sectionRef.current?.querySelector('.contact-title')
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

      // Form animation
      const form = sectionRef.current?.querySelector('.contact-form-container')
      if (form) {
        gsap.fromTo(
          form,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: form,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Info cards animation
      const info = sectionRef.current?.querySelector('.contact-info')
      if (info) {
        gsap.fromTo(
          info,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: info,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await submitMessage(formData)
      if (result.success) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setFormData({ name: '', email: '', message: '' })
      } else {
        setError(result.error || 'Failed to send message')
      }
    } catch {
      setError('Network error. Please try again.')
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 2,
        padding: '8rem 2rem 4rem',
      }}
    >
      {/* Section Header */}
      <div className="contact-title" style={{ textAlign: 'center', marginBottom: '5rem', opacity: 0 }}>
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
          // Get In Touch
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
          }}
        >
          <span style={{ color: '#f8fafc' }}>Ready to</span>{' '}
          <span className="gradient-text">Connect?</span>
        </h2>
        <div className="section-divider" style={{ margin: '0 auto' }} />
      </div>

      {/* Contact Content */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Left - Contact Info */}
        <div className="contact-info" style={{ opacity: 0 }}>
          <h3
            className="font-display"
            style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '1.5rem',
            }}
          >
            Let's Build Something
            <br />
            <span className="neon-text-gold">Amazing Together</span>
          </h3>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Whether you're interested in sponsorship, collaboration, or just want to
            geek out about drones — we'd love to hear from you.
          </p>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C9A87C" strokeWidth="1.5">
                    <rect x="2" y="4" width="16" height="12" rx="2" />
                    <path d="M2 4l8 6 8-6" />
                  </svg>
                ),
                label: 'Email',
                value: contactInfo.email,
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#34D399" strokeWidth="1.5">
                    <path d="M10 2C6 2 3 5.6 3 10c0 1.5.4 3 1.2 4.2L3 18l3.8-1.2c1.2.7 2.5 1 3.8 1 4.4 0 7.4-3.6 7.4-7.8S14 2 10 2z" />
                  </svg>
                ),
                label: 'Phone',
                value: contactInfo.phone,
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#34D399" strokeWidth="1.5">
                    <path d="M10 11a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M10 18s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
                  </svg>
                ),
                label: 'Location',
                value: contactInfo.location,
              },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(201, 168, 124, 0.12)',
                    border: '1px solid rgba(201, 168, 124, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1rem',
              }}
            >
              Follow Us
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                {
                  name: 'Instagram',
                  svg: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  name: 'Twitter',
                  svg: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  name: 'YouTube',
                  svg: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
                {
                  name: 'LinkedIn',
                  svg: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <div
                  key={social.name}
                  className="social-icon"
                  title={social.name}
                >
                  {social.svg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="contact-form-container" style={{ opacity: 0 }}>
          <form
            onSubmit={handleSubmit}
            className="glass-card"
            style={{ padding: '2.5rem' }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#f8fafc',
                marginBottom: '2rem',
                letterSpacing: '0.05em',
              }}
            >
              Send us a message
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="contact-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Message
                </label>
                <textarea
                  className="contact-input"
                  placeholder="Tell us what you're thinking..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              </div>

              {error && (
                <div style={{ color: '#f87171', fontSize: '0.82rem', padding: '0.5rem 0.75rem', background: 'rgba(248,113,113,0.1)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="contact-btn">
                {submitted ? '✓ MESSAGE SENT' : 'SEND MESSAGE'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          maxWidth: '1100px',
          margin: '6rem auto 0',
          padding: '2rem 0',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div
          className="font-display"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--color-text-muted)',
          }}
        >
          SKYHAWKS © {new Date().getFullYear()}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}
        >
          Engineered with ❤️ and caffeine
        </div>
      </footer>
    </section>
  )
}
