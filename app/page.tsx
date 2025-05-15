"use client"

import SplashScreen from "@/components/splash-screen"
import SignIn from "@/components/auth/sign-in"
import SignUp from "@/components/auth/sign-up"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showReferralBanner, setShowReferralBanner] = useState(false)
  const { data, isPending } = useSession()
  const [authTab, setAuthTab] = useState("signin")
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  
  const user = data?.user
  const isLoading = isPending

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
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
    <main className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden bg-[#080808]">
      <SplashScreen />
      
      {/* Background gradient effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] to-[#050505]" />
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-purple-900/10 to-transparent" />
        <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute top-40 -right-40 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

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

      <div className="container max-w-5xl mx-auto relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
            >
              Ready to take part in the 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"> revolution </span> 
              of online safety
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-[#a0a0a0] text-lg md:text-xl max-w-md md:max-w-xl mx-auto md:mx-0"
            >
              Join SafeCircle's mission to protect children online from harm with our cutting-edge security platform.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10"
            >
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/20"
                  >
                    Login / Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border border-[#1a1a1a] bg-[#0f0f0f]/95 backdrop-blur-sm p-0 shadow-xl shadow-purple-500/10">
                  <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Welcome to SafeCircle</DialogTitle>
                  </DialogHeader>
                  <div className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 p-6 rounded-lg overflow-hidden">
                    <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
                      <TabsList className="w-full flex mb-6 bg-[#111]/80 border border-[#222]">
                        <TabsTrigger 
                          value="signin" 
                          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-white"
                        >
                          Sign In
                        </TabsTrigger>
                        <TabsTrigger 
                          value="signup" 
                          className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-white"
                        >
                          Sign Up
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="signin">
                        <SignIn />
                      </TabsContent>
                      <TabsContent value="signup">
                        <SignUp />
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
          
          {/* Hero Image/Animation */}
          <motion.div 
            className="flex-1 mt-10 md:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-xl" />
              
              {/* Animated rings */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full animate-pulse" />
              <div className="absolute inset-6 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full animate-pulse [animation-delay:300ms]" />
              <div className="absolute inset-12 bg-gradient-to-br from-purple-600/40 to-blue-600/40 rounded-full animate-pulse [animation-delay:600ms]" />
              
              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 bg-[#0a0a0a] rounded-full border border-[#333] shadow-xl shadow-purple-500/5">
                  <div className="relative w-32 h-32">
                    <img
                      src="/images/logo-bw.webp"
                      alt="SafeCircle Logo"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
