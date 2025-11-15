import { motion } from 'framer-motion'
import { Brain, Globe, Share2 } from 'lucide-react'
import FeatureCard from './FeatureCard'
import React, { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Features = ({ onPositionsCalculated, onAllClicked }) => {
  const gridRef = useRef(null)
  const sectionRef = useRef(null)
  const leftPathRef = useRef(null)
  const middlePathRef = useRef(null)
  const rightPathRef = useRef(null)
  const buttonFillRef = useRef(null)
  const scrollButtonRef = useRef(null)
  const card0Ref = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)

  const features = useMemo(
    () => [
      {
        icon: Brain,
        title: 'AI Breakdown',
        description:
          'Intelligent analysis that transforms your big idea into structured, actionable steps with comprehensive BRD/PRD (Business Requirements Document/Product Requirements Document) generation',
      },
      {
        icon: Globe,
        title: 'Website Generation',
        description:
          "Professional websites created instantly, tailored to your startup's needs. Generate modern, responsive designs with optimized layouts, compelling copy, and seamless user experience. From landing pages to full multi-page sites, get production-ready code in minutes with built-in SEO best practices and mobile-first design.",
      },
      {
        icon: Share2,
        title: 'Marketing',
        description:
          'Auto-post engaging content to Instagram and Twitter with AI-generated visuals and copy. Integrated call management system for customer engagement with smart routing and automated responses.',
      },
    ],
    []
  )

  // Calculate positions of first 3 feature cards for any external usage
  useEffect(() => {
    if (gridRef.current && onPositionsCalculated) {
      const calculatePositions = () => {
        const cards = gridRef.current.querySelectorAll('.feature-card')
        const positions = Array.from(cards)
          .slice(0, 3)
          .map((card) => {
            const rect = card.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2 - window.innerWidth / 2
            const centerY = rect.top + rect.height / 2 - window.innerHeight / 2
            return { x: centerX / 100, y: -centerY / 100, z: 0 }
          })
        onPositionsCalculated(positions)
      }
      calculatePositions()
      window.addEventListener('resize', calculatePositions)
      return () => window.removeEventListener('resize', calculatePositions)
    }
  }, [onPositionsCalculated])

  // Scroll-driven sequential pipe fill & button fill (pinned section)
  useEffect(() => {
    if (!sectionRef.current) return
    const left = leftPathRef.current
    const middle = middlePathRef.current
    const right = rightPathRef.current
    const fill = buttonFillRef.current
    const button = scrollButtonRef.current
    const card0 = card0Ref.current
    const card1 = card1Ref.current
    const card2 = card2Ref.current
    if (!left || !middle || !right || !fill || !button || !card0 || !card1 || !card2) return

    // Get icon elements from each card
    const icon0 = card0.querySelector('.icon-animate')
    const icon1 = card1.querySelector('.icon-animate')
    const icon2 = card2.querySelector('.icon-animate')

    // Pulsing button until progress complete
    const pulseTween = gsap.to(button, {
      scale: 1.02,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    })

    // Prepare stroke animations
    const preparePath = (p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
      return len
    }
    preparePath(left)
    preparePath(middle)
    preparePath(right)
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left' })

    // Disable CSS animations on icons initially
    if (icon0) gsap.set(icon0, { opacity: 0.3 })
    if (icon1) gsap.set(icon1, { opacity: 0.3 })
    if (icon2) gsap.set(icon2, { opacity: 0.3 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300vh',
        scrub: true,
        pin: true,
        onUpdate: (st) => {
          if (st.progress >= 1 && pulseTween) pulseTween.kill()
        }
      }
    })

    // Brain (card0) -> right pipeline -> button 1/3
    tl.to(icon0, { opacity: 1, duration: 0.5 })
      .to(right, { strokeDashoffset: 0, opacity: 1, duration: 1 })
      .to(fill, { scaleX: 0.33, duration: 1 }, '<')
      // Globe (card1) -> middle pipeline -> button 2/3
      .to(icon1, { opacity: 1, duration: 0.5 })
      .to(middle, { strokeDashoffset: 0, opacity: 1, duration: 1 })
      .to(fill, { scaleX: 0.66, duration: 1 }, '<')
      // Share2 (card2) -> left pipeline -> button 3/3
      .to(icon2, { opacity: 1, duration: 0.5 })
      .to(left, { strokeDashoffset: 0, opacity: 1, duration: 1 })
      .to(fill, { scaleX: 1, duration: 1 }, '<')

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill()
      tl.kill()
      pulseTween.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 relative flex items-start"
    >
      <div className="container mx-auto mt-0 relative">
        {/* DIV 1: CARDS ON TOP */}
        <div
          ref={gridRef}
          className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-9"
        >
          {features.map((feature, index) => {
            const cardRef = index === 0 ? card0Ref : index === 1 ? card1Ref : card2Ref
            return (
              <div key={feature.title} className="feature-card relative" ref={cardRef}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              </div>
            )
          })}
        </div>

        {/* DIV 2: SVG PIPELINES (BEHIND) + SCROLL BUTTON */}
        <div className="relative mt-16 flex flex-col items-center z-10">
          {/* SVG pipelines - shorter, separate, ending around/behind button */}
          <div className="absolute -top-20 left-0 right-0 flex justify-center -z-10 pointer-events-none">
            <svg
              viewBox="0 0 1000 220"
              className="w-full max-w-5xl h-52"
            >
              <defs>
                {/* base line gradient */}
                <linearGradient id="pipeBase" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
                </linearGradient>

                {/* glow gradient */}
                <linearGradient id="pipeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Base pipes: all start at same height, end separately near button */}
              {/* Left pipe */}
              <path
                d="M0 0 V110 H430"
                stroke="url(#pipeBase)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Middle pipe */}
              <path
                d="M500 0 V110 H0"
                stroke="url(#pipeBase)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right pipe */}
              <path
                d="M1000 0 V110 H570"
                stroke="url(#pipeBase)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Glowing strokes that draw when card is clicked */}
              {/* LEFT */}
              <path
                ref={leftPathRef}
                d="M0 0 V110 H430"
                stroke="url(#pipeGlow)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]"
              />

              {/* MIDDLE */}
              <path
                ref={middlePathRef}
                d="M500 0 V110 H0"
                stroke="url(#pipeGlow)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]"
              />

              {/* RIGHT */}
              <path
                ref={rightPathRef}
                d="M1000 0 V110 H570"
                stroke="url(#pipeGlow)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                className="drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]"
              />
            </svg>
          </div>

          {/* SCROLL BUTTON with fill based on progress – closer to cards */}
          <button
            ref={scrollButtonRef}
            type="button"
            className="pointer-events-none relative mt-2 px-8 py-3 rounded-full border border-cyan-400/60 bg-slate-950/80 text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-cyan-100 shadow-[0_0_30px_rgba(59,130,246,0.65)] overflow-hidden"
          >
            <div
              ref={buttonFillRef}
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 opacity-90"
              style={{ transformOrigin: 'left' }}
            />
            <span className="relative z-10">Scroll</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Features
