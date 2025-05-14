"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"
import WaitlistForm from "@/components/waitlist/waitlist-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase"
import { CheckCheck, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SharePopout } from "@/components/account/share-popout"

export default function WaitlistTab() {
  const { data, isPending } = useSession()
  const user = data?.user
  const isLoading = isPending
  const searchParams = useSearchParams()
  const [showReferralBanner, setShowReferralBanner] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [referralData, setReferralData] = useState<{
    referralCode?: string
  }>({})

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
    
    const checkWaitlistSubmission = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("waitlist")
          .select("referral_code")
          .eq("email", user.email)
          .single()

        if (data && data.referral_code) {
          setHasSubmitted(true)
          setReferralData({
            referralCode: data.referral_code
          })
        }
      } catch (error) {
        console.error("Error checking waitlist submission:", error)
      }
    }

    checkWaitlistSubmission()
  }, [user])

  const handleFormSubmitted = (referralCode: string) => {
    setHasSubmitted(true)
    setReferralData({ referralCode })
  }

  return (
    <div className="max-w-3xl mx-auto">
      {hasSubmitted ? (
        <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
              <div className="bg-green-900/20 rounded-full p-3">
                <CheckCheck className="h-12 w-12 text-green-500" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">You're on the waitlist!</h2>
                <p className="text-[#a0a0a0] max-w-md mx-auto">
                  Thank you for joining our waitlist. We'll notify you when it's your turn to access SafeCircle.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button 
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0"
              >
                <Share2 className="h-4 w-4" />
                Share with friends
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <WaitlistForm 
          user={user} 
          onSubmitSuccess={handleFormSubmitted}
        />      )}
      
      <SharePopout 
        isOpen={isShareOpen} 
        setIsOpen={setIsShareOpen} 
        referralCode={referralData.referralCode}
      />
    </div>
  )
}
