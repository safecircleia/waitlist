"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { createBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Heart, CreditCard } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="text-center">
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-pink-900/20 p-4 rounded-full">
                <Heart className="h-10 w-10 text-pink-500" />
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Support Our Mission
            </motion.h2>
            
            <motion.p
              className="text-[#a0a0a0] mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your donation helps us protect children online by developing advanced safety technologies.
            </motion.p>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[10, 25, 50].map((amount) => (
                  <Button 
                    key={amount}
                    variant="outline" 
                    className="bg-[#1a1a1a] border-[#333] hover:bg-[#2a2a2a] hover:text-white h-20"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">${amount}</div>
                      <div className="text-xs text-[#a0a0a0]">One-time donation</div>
                    </div>
                  </Button>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg" />
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
                </Button>
              </motion.div>
              
              <motion.p
                className="text-xs text-[#a0a0a0] text-center mt-4"
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
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">How Your Donation Helps</h3>
              
              <div className="space-y-4 text-sm text-[#a0a0a0]">
                <p>• Develop advanced child protection technology</p>
                <p>• Research new safety measures for online platforms</p>
                <p>• Create educational resources for parents and children</p>
                <p>• Support moderation teams monitoring online safety</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
