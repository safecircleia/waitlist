"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { createBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Heart, CreditCard, Wallet, Sparkles, Construction } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDonation = async () => {
    setIsProcessing(true)
    // TODO: Implement payment processing based on selected method
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  const getAmount = () => {
    if (selectedAmount) return selectedAmount
    const amount = parseFloat(customAmount)
    return isNaN(amount) ? 0 : amount
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Alert className="bg-amber-900/20 border-amber-600/20">
          <Construction className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-400">
            This feature is currently under development. Donations are not being processed at this time.
          </AlertDescription>
        </Alert>

        <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
          <CardHeader className="text-center relative py-6">
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl rounded-full" />
                <div className="relative bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-4 rounded-full border border-pink-500/20">
                  <Heart className="h-8 w-8 text-pink-400" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Support Our Mission
              </h2>
              
              <p className="text-[#a0a0a0] text-sm max-w-xl mx-auto">
                Your donation helps us protect children online by developing advanced safety technologies.
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="grid gap-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[10, 25, 50].map((amount) => (
                  <Button 
                    key={amount}
                    variant="outline" 
                    className={`relative h-16 bg-[#1a1a1a] border-[#333] hover:bg-[#2a2a2a] hover:text-white transition-all duration-300 ${
                      selectedAmount === amount 
                        ? "border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-500/10" 
                        : "hover:border-purple-500/50"
                    }`}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount("")
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="relative text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        ${amount}
                      </div>
                      <div className="text-xs text-[#a0a0a0] mt-0.5">One-time donation</div>
                    </div>
                  </Button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-lg" />
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(null)
                  }}
                  className="w-full h-11 px-4 bg-[#1a1a1a]/80 border border-[#333] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Label className="text-white text-sm">Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-[#333] bg-[#1a1a1a] p-4 hover:bg-[#2a2a2a] peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:bg-purple-900/20 transition-all duration-300"
                    >
                      <div className="relative mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-lg rounded-full" />
                        <CreditCard className="relative h-6 w-6 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">Credit Card</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="sc"
                      id="sc"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="sc"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-[#333] bg-[#1a1a1a] p-4 hover:bg-[#2a2a2a] peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:bg-purple-900/20 transition-all duration-300"
                    >
                      <div className="relative mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-lg rounded-full" />
                        <Wallet className="relative h-6 w-6 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">$SC Token</span>
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg" />
                <Button 
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm font-medium shadow-lg shadow-purple-500/20 transition-all duration-300"
                  onClick={handleDonation}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      {paymentMethod === "card" && <CreditCard className="mr-2 h-4 w-4" />}
                      {paymentMethod === "sc" && <Wallet className="mr-2 h-4 w-4" />}
                      Donate ${getAmount()}
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.p
                className="text-xs text-[#a0a0a0] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                All donations are secure and encrypted. You can also choose a custom amount.
              </motion.p>
            </div>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
            <CardContent className="p-6 relative">
              <h3 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                How Your Donation Helps
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3 text-[#a0a0a0]">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-1 rounded-full bg-purple-900/20 border border-purple-500/20">
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </div>
                    <p className="text-sm">Develop advanced child protection technology</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-1 rounded-full bg-purple-900/20 border border-purple-500/20">
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </div>
                    <p className="text-sm">Research new safety measures for online platforms</p>
                  </div>
                </div>
                <div className="space-y-3 text-[#a0a0a0]">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-1 rounded-full bg-purple-900/20 border border-purple-500/20">
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </div>
                    <p className="text-sm">Create educational resources for parents and children</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-1 rounded-full bg-purple-900/20 border border-purple-500/20">
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </div>
                    <p className="text-sm">Support moderation teams monitoring online safety</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
