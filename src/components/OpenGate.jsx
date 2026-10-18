import { motion, useReducedMotion } from 'framer-motion'

export default function OpenGate({ onOpen }) {
  const reduce = useReducedMotion()

  return (
    <div className="gate">
      <motion.p
        className="gate-pre"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring', bounce: 0.5 }}
      >
        psst… a little something for you
      </motion.p>

      <motion.button
        className="open-btn"
        onClick={onOpen}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.55, type: 'spring', bounce: 0.55, duration: 0.9 }}
        whileHover={{ scale: 1.08, rotate: -2 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open your surprise"
      >
        <motion.span
          className="open-heart"
          animate={
            reduce
              ? {}
              : { rotate: [-8, 8, -8], y: [0, -4, 0] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌷
        </motion.span>
        <span className="open-label">open me</span>
      </motion.button>

      <motion.p
        className="gate-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.75, 0.5, 0.75], y: [0, -3, 0] }}
        transition={{
          opacity: { delay: 1.3, duration: 1 },
          y: reduce ? {} : { delay: 1.3, duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        tap to unravel ♡
      </motion.p>
    </div>
  )
}
