"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

interface WaitlistPositionProps {
  position: number
  referrals: number
}

export default function WaitlistPosition({ position, referrals = 0 }: WaitlistPositionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Trophy className="h-4 w-4 text-[#a0a0a0] mr-2" />
          <span className="text-sm text-[#a0a0a0]">Your position</span>
        </div>
        <span className="text-sm font-medium text-white">#{position}</span>
      </div>

      {referrals > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-[#a0a0a0] italic">
          You've moved up {referrals} {referrals === 1 ? "position" : "positions"} from referrals!
        </motion.div>
      )}
    </div>
  )
}
