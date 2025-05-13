"use client"

import { motion } from "framer-motion"

interface FormProgressBarProps {
  progress: number
}

export default function FormProgressBar({ progress }: FormProgressBarProps) {
  return (
    <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-white"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
