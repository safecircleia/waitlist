"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface GradientOrbProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  color?: string
  size?: string
  opacity?: number
  blur?: string
}

export default function GradientOrb({
  position = "top-right",
  color = "from-violet-600/10 to-indigo-600/5",
  size = "w-[500px] h-[500px]",
  opacity = 0.3,
  blur = "blur-[100px]",
}: GradientOrbProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let x = 0
    let y = 0

    switch (position) {
      case "top-left":
        x = -50
        y = -50
        break
      case "top-right":
        x = 50
        y = -50
        break
      case "bottom-left":
        x = -50
        y = 50
        break
      case "bottom-right":
        x = 50
        y = 50
        break
    }

    setCoords({ x, y })
  }, [position])

  return (
    <motion.div
      className={`absolute ${size} rounded-full bg-gradient-to-br ${color} ${blur} opacity-${opacity * 10} pointer-events-none`}
      style={{
        x: `${coords.x}%`,
        y: `${coords.y}%`,
      }}
      animate={{
        x: [coords.x, coords.x + 5, coords.x],
        y: [coords.y, coords.y + 5, coords.y],
      }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  )
}
