"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -20 
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.19, 1, 0.22, 1] // Custom cubic-bezier for smooth ease-out
          }}
        >
          <div className="absolute inset-0">
            <AnimatedBackground />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 1.2,
              opacity: 0,
              y: -30,
              rotate: 10,
            }}
            transition={{
              duration: 1,
              ease: [0.19, 1, 0.22, 1], // Custom cubic-bezier for smooth ease-out
            }}
            className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center"
          >
            <motion.div
              className="absolute inset-0 rounded-full opacity-40 blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ 
                opacity: 0, 
                scale: 1.2,
                rotate: 15
              }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5,
                exit: { duration: 0.7 }
              }}
              className="relative z-10 bg-transparent rounded-full w-full h-full flex items-center justify-center"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <Image
                  src="/images/logo-bw.webp"
                  alt="SafeCircle Logo"
                  fill
                  sizes="(max-width: 768px) 80px, 96px"
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simple animated background for splash screen
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 4 + 1
        const duration = Math.random() * 10 + 20
        const delay = Math.random() * 2
        const initialX = Math.random() * 100
        const initialY = Math.random() * 100

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: size,
              height: size,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}
