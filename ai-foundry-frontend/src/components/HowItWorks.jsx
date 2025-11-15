import { motion } from 'framer-motion'
import React from 'react'
import { MessageSquare, Search, Rocket, TrendingUp } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Share Your Vision',
      description: 'Tell us about your startup idea in plain language—no technical jargon needed.',
    },
    {
      number: '02',
      icon: Search,
      title: 'AI Breaks It Down',
      description: 'Our AI analyzes and creates a detailed workflow with actionable tasks.',
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Instant Deployment',
      description: 'Get your website generated and deployed while we prep your social content.',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Automated Growth',
      description: 'Watch your startup grow as we handle posting and track your progress.',
    },
  ]

  return (
    <section id="learn" className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl w-full">

        {/* First Way - If you have idea for your startup */}
        <div className="mb-20">
          <div className="relative">
            {/* Connecting Line - Hidden on mobile */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 dark:from-blue-800 dark:via-purple-800 dark:to-blue-800" 
                 style={{ margin: '0 10%' }}></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={`way1-${step.number}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 md:p-8 transition-all duration-300 relative group overflow-hidden"
                  style={{
                    aspectRatio: '1/1',
                    background:
                      'linear-gradient(to bottom right, #C084FC, #A855F7 20%, #7C3AED 65%, #6B21A8)',
                  }}
                >
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-white/20 group-hover:text-white/40 transition-colors duration-200">
                    {step.number}
                  </div>

                  <div className="flex flex-col h-full justify-center items-center text-center gap-4">
                    {/* Icon */}
                    <div className="relative">
                      {/* Dark silhouette background */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <step.icon className="w-16 h-16 md:w-20 md:h-20 text-black/10" />
                      </div>
                      {/* Animated icon on top */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="icon-animate relative"
                      >
                        <step.icon className="w-16 h-16 md:w-20 md:h-20 text-white" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-bold text-white heading-gradient press-start-2p-regular">
                      {step.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed px-2">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default HowItWorks

