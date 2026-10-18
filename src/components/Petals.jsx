import { motion, useReducedMotion } from 'framer-motion'

// A single soft petal shape. Reusable with size + color.
export function Petal({ size = 36, color = '#f4b8c6', style, className }) {
  const id = `pg-${color.replace('#', '')}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff7f0" stopOpacity="0.95" />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <path
        d="M50 4 C70 28 86 48 72 74 C64 90 36 90 28 74 C14 48 30 28 50 4 Z"
        fill={`url(#${id})`}
      />
      <path
        d="M50 14 C50 40 50 66 50 82"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// A plump little heart.
export function Heart({ size = 28, color = '#f08ba6', style, className }) {
  const id = `hg-${color.replace('#', '')}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff2f6" />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <path
        d="M50 86 C18 62 8 44 8 30 C8 16 20 8 32 8 C41 8 47 13 50 20 C53 13 59 8 68 8 C80 8 92 16 92 30 C92 44 82 62 50 86 Z"
        fill={`url(#${id})`}
      />
      <ellipse cx="34" cy="28" rx="7" ry="5" fill="#ffffff" opacity="0.6" />
    </svg>
  )
}

// A four-point twinkle sparkle.
export function Sparkle({ size = 18, color = '#ffd98a', style, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z"
        fill={color}
      />
    </svg>
  )
}

const PALETTE = ['#f4b8c6', '#f6cdd8', '#e8a7bd', '#f7dce0', '#eec6c0']

// Deterministic pseudo random so layout is stable per render.
function rand(seed) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// A field of petals, hearts & sparkles drifting up the screen.
export function AmbientPetals({ count = 12 }) {
  const reduce = useReducedMotion()
  const items = Array.from({ length: count }, (_, i) => {
    const left = rand(i + 1) * 100
    const size = 16 + rand(i + 2) * 28
    const delay = rand(i + 3) * 9
    const duration = 13 + rand(i + 4) * 12
    const drift = (rand(i + 5) - 0.5) * 90
    const kindRoll = rand(i + 9)
    const kind = kindRoll < 0.55 ? 'petal' : kindRoll < 0.85 ? 'heart' : 'sparkle'
    const color = PALETTE[i % PALETTE.length]
    return { i, left, size, delay, duration, drift, kind, color }
  })

  return (
    <div className="ambient" aria-hidden="true">
      {items.map((p) => (
        <motion.div
          key={p.i}
          className="ambient-petal"
          style={{ left: `${p.left}%` }}
          initial={{ y: '-15vh', x: 0, rotate: p.i * 30, opacity: 0 }}
          animate={
            reduce
              ? { opacity: 0.35 }
              : {
                  y: '115vh',
                  x: [0, p.drift, -p.drift * 0.5, p.drift * 0.3],
                  rotate: [p.i * 30, p.i * 30 + 200],
                  opacity: [0, 0.85, 0.85, 0],
                }
          }
          transition={
            reduce
              ? { duration: 1 }
              : { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }
          }
        >
          {p.kind === 'petal' ? (
            <Petal size={p.size} color={p.color} />
          ) : p.kind === 'heart' ? (
            <Heart size={p.size * 0.8} color="#f08ba6" />
          ) : (
            <Sparkle size={p.size * 0.7} color="#ffd98a" />
          )}
        </motion.div>
      ))}
    </div>
  )
}
