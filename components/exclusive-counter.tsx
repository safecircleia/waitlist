"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ExclusiveCounterProps {
  initialCount?: number
  maxSpots?: number
}

export default function ExclusiveCounter({ initialCount = 37, maxSpots = 100 }: ExclusiveCounterProps) {
  const [count, setCount] = useState(initialCount)

  // Simulate random spot decreases occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to decrease the counter by 1
      if (Math.random() < 0.1 && count > 1) {
        setCount((prev) => prev - 1)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [count])

  const percentage = Math.round((count / maxSpots) * 100)

  return (
    <motion.div
      className="w-full bg-[#111111] border border-[#222222] rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-[#a0a0a0]">Limited access</span>
        <span className="text-xs font-medium text-white">{count} spots left</span>
      </div>

      <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}
