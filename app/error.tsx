"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md p-8 rounded-2xl border border-[#1a1a1a] shadow-xl relative overflow-hidden">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Oops!</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-medium text-white mb-2">Something went wrong</h2>
            <p className="text-[#a0a0a0] mb-6">
              An error occurred while loading this page. Please try again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={reset} 
                className="flex-1"
              >
                Try Again
              </Button>
              <Link href="/" passHref className="flex-1">
                <Button className="w-full">
                  Return Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
