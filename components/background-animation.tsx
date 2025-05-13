"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function BackgroundAnimation() {
  const [elements, setElements] = useState<{ x: number; y: number; size: number; delay: number; duration: number }[]>(
    [],
  )

  useEffect(() => {
    // Generate random elements
    const newElements = Array.from({ length: 6 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 4,
      duration: Math.random() * 8 + 12,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
          }}
          animate={{
            y: [0, -20, 0],
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
