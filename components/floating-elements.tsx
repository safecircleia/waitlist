"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function FloatingElements() {
  const [elements, setElements] = useState<{ x: number; y: number; size: number; delay: number; duration: number }[]>(
    [],
  )

  useEffect(() => {
    // Generate random elements
    const newElements = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white/5"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
