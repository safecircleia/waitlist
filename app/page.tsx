"use client"

import SplashScreen from "@/components/splash-screen"
import SignIn from "@/components/auth/sign-in"
import SignUp from "@/components/auth/sign-up"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FloatingElements from "@/components/floating-elements"
import GradientOrb from "@/components/gradient-orb"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showReferralBanner, setShowReferralBanner] = useState(false)
  const { data, isPending } = useSession()
  const [authTab, setAuthTab] = useState("signin")
  
  const user = data?.user
  const isLoading = isPending

  // Redirect authenticated users to the waitlist page
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/waitlist')
    }
  }, [isLoading, user, router])

  useEffect(() => {
    // Check if there's a referral code in the URL
    const ref = searchParams.get("ref")
    if (ref) {
      setShowReferralBanner(true)
      const timer = setTimeout(() => {
        setShowReferralBanner(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      <SplashScreen />

      {/* Floating elements and gradient orbs for additional visual effects */}
      <FloatingElements />
      <GradientOrb position="top-right" color="from-violet-600/10 to-indigo-600/5" />
      <GradientOrb position="bottom-left" color="from-blue-600/10 to-violet-600/5" />

      <AnimatePresence>
        {showReferralBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-50"
          >
            <div className="bg-[#1a1a1a]/80 border border-[#333333] rounded-lg p-3 text-center text-sm text-white shadow-lg backdrop-blur-sm">
              You've been referred by a friend. You'll get priority access!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 text-center relative z-10"
      >
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">SafeCircle</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[#a0a0a0] max-w-md mx-auto"
        >
          Join our waitlist to be the first to experience our revolutionary security platform.
        </motion.p>
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md p-8 rounded-2xl border border-[#1a1a1a] shadow-xl relative overflow-hidden">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Join the waitlist</h2>
              <p className="text-[#a0a0a0] text-sm">Please sign in or create an account to continue.</p>
            </div>
            <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
              <TabsList className="w-full flex mb-6">
                <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignIn />
              </TabsContent>
              <TabsContent value="signup">
                <SignUp />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  )
}
