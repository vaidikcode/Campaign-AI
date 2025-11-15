import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FeatureCard = ({ icon: Icon, title, description, delay = 0, isExpanded, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}
      className="glass rounded-2xl p-6 md:p-8 transition-all duration-300 group overflow-hidden pointer-events-none"
      style={{
        aspectRatio: '1/1',
        background:
          'linear-gradient(to bottom right, #C084FC, #A855F7 20%, #7C3AED 65%, #6B21A8)',
      }}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            {/* Dark silhouette background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-16 h-16 md:w-20 md:h-20 text-black/10" />
            </div>
            {/* Animated icon on top */}
            <div className="icon-animate relative">
              <Icon className="w-16 h-16 md:w-20 md:h-20" />
            </div>
          </div>

          <h3 className="urbanist-heading text-xl md:text-2xl font-bold text-white heading-gradient">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}

export default FeatureCard
