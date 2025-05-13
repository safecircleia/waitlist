"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { redirect, useSearchParams } from "next/navigation"
import WaitlistForm from "@/components/waitlist/waitlist-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedBackground from "@/components/animated-background"
import FloatingElements from "@/components/floating-elements"
import GradientOrb from "@/components/gradient-orb"
import { CheckCheck, ClipboardCheck } from "lucide-react"
import ReferralSystem from "@/components/waitlist/referral-system"

export default function WaitlistPage() {
  const { data, isPending } = useSession()
  const user = data?.user
  const isLoading = isPending
    // Debug logs
  console.log("Waitlist Page - Session Data:", data);
  console.log("Waitlist Page - User:", user);
  console.log("Waitlist Page - Is Loading:", isLoading);
  
  const searchParams = useSearchParams()
  const [showReferralBanner, setShowReferralBanner] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [referralData, setReferralData] = useState<{
    referralCode?: string
  }>({})

  // Check if the user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Waitlist Page - No user detected, redirecting to homepage");
      // Redirect to homepage if not authenticated
      redirect('/')
    }
  }, [isLoading, user])

  // Check if there's a referral code in the URL
  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setShowReferralBanner(true)
      const timer = setTimeout(() => {
        setShowReferralBanner(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Check if user has already submitted the waitlist form
  useEffect(() => {
    if (!user) return
    
    console.log("Waitlist Page - User detected, checking waitlist submission");    const checkWaitlistSubmission = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("waitlist")
          .select("referral_code")
          .eq("email", user.email)
          .single()

        console.log("Waitlist Page - Supabase response:", data, error);

        if (data) {
          setHasSubmitted(true)
          setReferralData({
            referralCode: data.referral_code,
          })
        }
      } catch (error) {
        console.error("Error checking waitlist submission:", error)
      }
    }

    checkWaitlistSubmission()  }, [user])

  // Handle successful form submission
  const handleFormSubmitted = (referralCode: string) => {
    setHasSubmitted(true)
    setReferralData({
      referralCode
    })
  }

  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Animated backgrounds */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>
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
          {hasSubmitted 
            ? "Thanks for being part of our community!"
            : "Join our waitlist to be the first to experience our revolutionary security platform."
          }
        </motion.p>
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : hasSubmitted ? (
          <Card className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md border border-[#1a1a1a] shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCheck className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">You're on the list!</h2>
                <p className="text-sm text-[#a0a0a0] max-w-sm">
                  Thanks for joining our waitlist.
                </p>
              </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center pt-4">
                  <Link href="/account">
                    <Button variant="outline" className="w-full">
                      Manage Your Account
                    </Button>
                  </Link>
                </div>
            </CardContent>
          </Card>
        ) : (
          <WaitlistForm 
            user={user} 
            onSubmitSuccess={handleFormSubmitted}
          />
        )}
      </div>
    </main>
  )
}
