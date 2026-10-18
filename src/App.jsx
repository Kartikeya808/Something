import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import OpenGate from './components/OpenGate.jsx'
import Reveal from './components/Reveal.jsx'
import { AmbientPetals } from './components/Petals.jsx'

// ── Edit these to personalize ───────────────────────────────────────────────
export const CONFIG = {
  // Drop your lily image into /public and point to it here.
  // Falls back to a hand-drawn placeholder if the file isn't found.
  imageSrc: '/portrait.jpg',
  // Keep it minimal — the lilies do the talking.
  caption: 'for you',
}
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState('gate') // 'gate' | 'reveal'

  return (
    <main className="stage">
      <AmbientPetals count={phase === 'gate' ? 8 : 12} />

      <AnimatePresence mode="wait">
        {phase === 'gate' ? (
          <motion.div
            key="gate"
            className="screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            <OpenGate onOpen={() => setPhase('reveal')} />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            className="screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
          >
            <Reveal onReplay={() => setPhase('gate')} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
