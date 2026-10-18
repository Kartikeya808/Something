import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Petal, Heart, Sparkle } from './Petals.jsx'
import { CONFIG } from '../App.jsx'

const PALETTE = ['#f4b8c6', '#f6cdd8', '#e8a7bd', '#f7dce0', '#eec6c0', '#f2b0c2']

function rand(seed) {
  const x = Math.sin(seed * 7919) * 10000
  return x - Math.floor(x)
}

// Build a cluster of petals scattered across the portrait that will part away.
function buildCover(count) {
  return Array.from({ length: count }, (_, i) => {
    const cols = 4
    const col = i % cols
    const row = Math.floor(i / cols)
    const left = (col / (cols - 1)) * 86 + 7 + (rand(i + 1) - 0.5) * 16
    const top = (row / Math.ceil(count / cols - 1)) * 86 + 7 + (rand(i + 2) - 0.5) * 14
    const cx = left - 50
    const cy = top - 50
    const mag = Math.hypot(cx, cy) || 1
    return {
      i,
      left: Math.max(0, Math.min(92, left)),
      top: Math.max(0, Math.min(92, top)),
      size: 54 + rand(i + 3) * 46,
      rot: rand(i + 4) * 360,
      fx: (cx / mag) * (120 + rand(i + 5) * 120),
      fy: (cy / mag) * (120 + rand(i + 6) * 120) - 60,
      spin: (rand(i + 7) - 0.5) * 220,
      color: PALETTE[i % PALETTE.length],
      delay: rand(i + 8) * 0.25,
    }
  })
}

// Little hearts that pop outward from the frame when it opens.
function buildBurst(count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + rand(i) * 0.5
    const dist = 90 + rand(i + 1) * 120
    return {
      i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 18 + rand(i + 2) * 22,
      delay: rand(i + 3) * 0.2,
    }
  })
}

// Twinkling sparkles pinned near the frame corners.
const FRAME_SPARKLES = [
  { top: '-4%', left: '-4%', size: 26, delay: 0 },
  { top: '-5%', left: '92%', size: 20, delay: 0.6 },
  { top: '94%', left: '-3%', size: 22, delay: 1.1 },
  { top: '92%', left: '90%', size: 28, delay: 0.3 },
  { top: '44%', left: '-6%', size: 16, delay: 0.9 },
  { top: '30%', left: '96%', size: 18, delay: 1.4 },
]

export default function Reveal({ onReplay }) {
  const reduce = useReducedMotion()
  const [parted, setParted] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [imgSrc, setImgSrc] = useState(CONFIG.imageSrc)
  const cover = useMemo(() => buildCover(16), [])
  const burst = useMemo(() => buildBurst(14), [])

  useEffect(() => {
    const t1 = setTimeout(() => setParted(true), reduce ? 200 : 650)
    const t2 = setTimeout(() => setShowCaption(true), reduce ? 500 : 2100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduce])

  return (
    <div className="reveal">
      <div className="frame-wrap">
      <div className="frame">
        <motion.img
          className="portrait"
          src={imgSrc}
          onError={() => setImgSrc('/placeholder-lilies.svg')}
          alt="Lilies, for you"
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(16px)' }}
          animate={
            parted
              ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0.25, scale: 1.05, filter: 'blur(16px)' }
          }
          transition={{ duration: reduce ? 0.4 : 1.6, ease: 'easeOut' }}
          draggable={false}
        />

        <div className="vignette" aria-hidden="true" />

        {/* Petal cover that parts away */}
        <AnimatePresence>
          {!parted && (
            <div className="cover" aria-hidden="true">
              {cover.map((p) => (
                <motion.div
                  key={p.i}
                  className="cover-petal"
                  style={{ left: `${p.left}%`, top: `${p.top}%` }}
                  initial={{ x: 0, y: 0, rotate: p.rot, opacity: 1, scale: 1 }}
                  exit={{
                    x: reduce ? 0 : p.fx,
                    y: reduce ? -20 : p.fy,
                    rotate: p.rot + (reduce ? 0 : p.spin),
                    opacity: 0,
                    scale: reduce ? 0.9 : 1.15,
                  }}
                  transition={{
                    duration: reduce ? 0.4 : 1.4,
                    delay: reduce ? 0 : p.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Petal size={p.size} color={p.color} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Heart burst the moment it opens */}
        {!reduce && (
          <AnimatePresence>
            {parted && !showCaption && (
              <div className="burst" aria-hidden="true">
                {burst.map((b) => (
                  <motion.div
                    key={b.i}
                    className="burst-heart"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: b.x, y: b.y, scale: 1, opacity: 0 }}
                    transition={{ duration: 1.3, delay: b.delay, ease: 'easeOut' }}
                  >
                    <Heart size={b.size} color="#f08ba6" />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Twinkling sparkles around the frame once revealed */}
      {parted &&
        FRAME_SPARKLES.map((s, i) => (
          <motion.div
            key={i}
            className="frame-sparkle"
            style={{ top: s.top, left: s.left }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={
              reduce
                ? { scale: 1, opacity: 0.8 }
                : { scale: [0, 1, 0.6, 1], opacity: [0, 1, 0.5, 1], rotate: [0, 90] }
            }
            transition={
              reduce
                ? { duration: 0.4 }
                : { duration: 3, delay: 1.6 + s.delay, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <Sparkle size={s.size} color="#ffd98a" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCaption && (
          <motion.p
            className="caption"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
          >
            {CONFIG.caption}
            <motion.span
              className="caption-flower"
              animate={reduce ? {} : { rotate: [-10, 10, -10], y: [0, -3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {' '}
              🌷
            </motion.span>
          </motion.p>
        )}
      </AnimatePresence>

      {showCaption && (
        <motion.button
          className="replay"
          onClick={onReplay}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          whileHover={{ opacity: 1, rotate: -30, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.4 }}
          aria-label="Watch again"
        >
          ↺
        </motion.button>
      )}
    </div>
  )
}
