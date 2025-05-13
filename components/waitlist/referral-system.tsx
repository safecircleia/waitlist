"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Mail, Twitter } from "lucide-react"

interface ReferralSystemProps {
  referralCode: string
}

export default function ReferralSystem({ referralCode }: ReferralSystemProps) {
  const [copied, setCopied] = useState(false)

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}?ref=${referralCode}` : `?ref=${referralCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Join me on SafeCircle's exclusive waitlist")
    const body = encodeURIComponent(
      `I thought you might be interested in SafeCircle. Join the waitlist here: ${referralLink}`,
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      "I just joined the exclusive waitlist for @SafeCircle. Join me here:",
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-full space-y-4 mt-4"
    >
      <div className="border-t border-[#222222] pt-6">
        <div className="mb-2">
          <h3 className="text-white text-base font-medium">Share the waitlist</h3>
        </div>
        <p className="text-[#a0a0a0] text-sm mb-4">
          Share SafeCircle with your friends and network.
        </p>

        <div className="flex items-center space-x-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-[#0d0d0d] border-[#222222] text-[#a0a0a0] text-sm h-10 focus:border-[#444444] focus:ring-[#444444]"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 border-[#333333] hover:bg-[#1a1a1a] transition-colors"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#333333] text-white text-sm bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
            onClick={shareViaEmail}
          >
            <Mail className="mr-2 h-4 w-4" /> Share via Email
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#333333] text-white text-sm bg-[#1a1a1a] hover:bg-[#222222] transition-colors"
            onClick={shareViaTwitter}
          >
            <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
