"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
          ease: [0.19, 1, 0.22, 1],
        }}
        className="w-20 h-20 relative flex items-center justify-center"
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
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear"
          }}
          className="relative z-10 bg-transparent rounded-full w-full h-full flex items-center justify-center"
        >
          <div className="relative w-16 h-16">
            <Image
              src="/images/logo-bw.webp"
              alt="SafeCircle Logo"
              fill
              sizes="64px"
              priority
              className="object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
