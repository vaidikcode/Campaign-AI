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
    <section id="learn" className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
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
                  className="glass rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 relative group"
                >
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-gray-200 dark:text-gray-700 group-hover:text-blue-400 dark:group-hover:text-blue-600 transition-colors duration-200">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
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

