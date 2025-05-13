"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"

interface NotificationIndicatorProps {
  show: boolean
}

export default function NotificationIndicator({ show }: NotificationIndicatorProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)

    if (show) {
      // Hide the notification after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 bg-[#1a1a1a]/80 border border-[#333333] rounded-lg p-3 shadow-lg z-50 flex items-center backdrop-blur-sm"
        >
          <Bell className="h-4 w-4 text-white mr-2" />
          <span className="text-sm text-white">Email notification sent to referrer!</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
