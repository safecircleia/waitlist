"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Share2, Mail, Twitter } from "lucide-react"

interface ReferralSystemProps {
  referralCode: string
  referralCount?: number
}

export default function ReferralSystem({ referralCode, referralCount = 0 }: ReferralSystemProps) {
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

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
      `I thought you might be interested in SafeCircle. Use my referral link to get priority access: ${referralLink}`,
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      "I just joined the exclusive waitlist for @SafeCircle. Use my referral link to get priority access:",
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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-base font-medium">Get priority access</h3>
          <div className="bg-[#1a1a1a] px-3 py-1 rounded-full text-xs text-white border border-[#333333]">
            {referralCount} {referralCount === 1 ? 'referral' : 'referrals'}
          </div>
        </div>
        <p className="text-[#a0a0a0] text-sm mb-4">
          Share your referral link to move up the waitlist. Each referral improves your position.
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

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#333333] text-white text-sm hover:bg-[#1a1a1a] transition-colors"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <Share2 className="mr-2 h-4 w-4" /> Share with friends
          </Button>
        </div>

        <AnimatePresence>
          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2 overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
