"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { submitToWaitlist, type WaitlistFormData } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2, CheckCircle2, Mail, User, Building2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import NotificationIndicator from "../notification-indicator"
import FormProgressBar from "./form-progress-bar"
import { createBrowserClient } from "@/lib/supabase"

// Define the schema for form validation
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().optional(),
  referralCode: z.string().optional(),
})


// Accept user prop for autofill and onSubmitSuccess callback
export default function WaitlistForm({ 
  user,
  onSubmitSuccess
}: { 
  user?: { name?: string; email?: string };
  onSubmitSuccess?: (referralCode: string) => void 
}) {
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean
    message?: string
    referralCode?: string
  }>({})
  const [showNotification, setShowNotification] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [isChecking, setIsChecking] = useState(true) // Add state to track if we're checking waitlist status


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })


  // Autofill if user changes (e.g. after login)
  useEffect(() => {
    if (user?.name) setValue("name", user.name)
    if (user?.email) setValue("email", user.email)
  }, [user, setValue])

  // Watch form fields to calculate progress
  const watchedFields = watch(["name", "email", "company"])

  // Calculate form progress
  useEffect(() => {
    let progress = 0
    if (watchedFields[0] && watchedFields[0].length >= 2) progress += 40
    if (watchedFields[1] && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedFields[1])) progress += 40
    if (watchedFields[2] && watchedFields[2].length > 0) progress += 20
    else if (isValid && isDirty) progress += 20

    setFormProgress(progress)
  }, [watchedFields, isValid, isDirty])


  // Check if user has already submitted the waitlist form
  useEffect(() => {
    if (!user?.email) {
      setIsChecking(false)
      return
    }

    const checkWaitlistSubmission = async () => {
      try {
        console.log("WaitlistForm - Checking if user already joined waitlist:", user.email)
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("waitlist")
          .select("referral_code")
          .eq("email", user.email)
          .single()

        console.log("WaitlistForm - Waitlist check response:", data, error)

        if (data?.referral_code && onSubmitSuccess) {
          console.log("WaitlistForm - User already on waitlist, calling onSubmitSuccess")
          // If user is already registered, call the onSubmitSuccess callback
          onSubmitSuccess(data.referral_code)
        }
      } catch (error) {
        console.error("Error checking waitlist status:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkWaitlistSubmission()
  }, [user, onSubmitSuccess])


  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true)

    try {
      const result = await submitToWaitlist(data)
      setFormStatus(result)

      if (result.success) {
        reset()
        setFormProgress(0)

        // Call the callback if provided
        if (result.referralCode && onSubmitSuccess) {
          onSubmitSuccess(result.referralCode)
        }

        // Show notification if this was a referral
        if (data.referralCode) {
          setShowNotification(true)
        }
      }
    } catch (error) {
      setFormStatus({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <NotificationIndicator show={showNotification} />

      <AnimatePresence mode="wait">
        {isChecking ? (
          <div className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md p-8 rounded-2xl border border-[#1a1a1a] shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 text-white animate-spin mb-4" />
            <p className="text-[#a0a0a0] text-sm">Checking waitlist status...</p>
          </div>
        ) : formStatus.success ? (
          <SuccessState referralCode={formStatus.referralCode} onReset={() => setFormStatus({})} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md p-8 rounded-2xl border border-[#1a1a1a] shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(120,_120,_120,_0.05),_transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(120,_120,_120,_0.05),_transparent_60%)]"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Join the waitlist</h2>
                <div className="h-10 w-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white opacity-70" />
                </div>
              </div>

              <FormProgressBar progress={formProgress} />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <div className="space-y-4">
                  <FormField
                    id="name"
                    label="Full Name"
                    placeholder="Enter your name"
                    icon={<User className="h-4 w-4 text-[#666666]" />}
                    error={errors.name?.message}
                    {...register("name")}
                  />

                  <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4 text-[#666666]" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <FormField
                    id="company"
                    label="Company (optional)"
                    placeholder="Your organization"
                    icon={<Building2 className="h-4 w-4 text-[#666666]" />}
                    {...register("company")}
                  />

                  {/* Hidden field for referral code */}
                  <input type="hidden" {...register("referralCode")} />
                </div>

                {searchParams.get("ref") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-[#1a1a1a]/50 backdrop-blur-sm border border-[#333333] rounded-lg"
                  >
                    <p className="text-xs text-[#a0a0a0]">
                      You've been referred by a friend. You'll get priority access to SafeCircle.
                    </p>
                  </motion.div>
                )}

                {formStatus.message && !formStatus.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-[#2a1215]/50 backdrop-blur-sm border border-[#5c2428] rounded-lg"
                  >
                    <p className="text-xs text-[#ff4d4f]">{formStatus.message}</p>
                  </motion.div>
                )}

                <SubmitButton isSubmitting={isSubmitting} isValid={isValid && isDirty} />

                <div className="text-center mt-4">
                  <p className="text-[#666666] text-xs">
                    By joining, you agree to our{" "}
                    <a href="#" className="text-white hover:text-[#a0a0a0] transition-colors">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-white hover:text-[#a0a0a0] transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Form field component with animations
function FormField({
  id,
  label,
  error,
  icon,
  ...props
}: {
  id: string
  label: string
  error?: string
  icon?: React.ReactNode
  [key: string]: any
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#a0a0a0] text-sm font-medium flex items-center">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <Input
          id={id}
          className={`h-11 pl-10 pr-3 bg-[#0d0d0d] border-[#222222] text-white placeholder:text-[#555555] text-sm transition-all duration-200
            ${error ? "border-[#ff4d4f] focus:ring-[#ff4d4f]" : "border-[#222222] focus:border-[#444444] focus:ring-[#444444]"}
            hover:border-[#333333]`}
          {...props}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-[#ff4d4f] mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// Animated submit button
function SubmitButton({ isSubmitting, isValid }: { isSubmitting: boolean; isValid: boolean }) {
  return (
    <motion.div
      whileHover={isValid && !isSubmitting ? { scale: 1.02 } : {}}
      whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
    >
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={`w-full h-12 rounded-lg text-sm font-medium transition-all duration-300
          ${isValid ? "bg-white hover:bg-[#f0f0f0] text-black" : "bg-[#1a1a1a] text-[#666666] cursor-not-allowed"}`}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center">
            Request Access <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </motion.div>
  )
}

// Success state component
function SuccessState({ referralCode, onReset }: { referralCode?: string; onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gradient-to-b from-[#0f0f0f]/90 to-[#0a0a0a]/90 backdrop-blur-md p-8 rounded-2xl border border-[#1a1a1a] shadow-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(120,_120,_120,_0.05),_transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(120,_120,_120,_0.05),_transparent_60%)]"></div>

      <div className="flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 border border-[#333333]"
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-white">You're on the list!</h3>
          <p className="text-[#a0a0a0] text-sm max-w-sm">
            Thank you for joining our waitlist. We'll notify you when it's your turn to access SafeCircle.
          </p>

          {referralCode && <ReferralSystem referralCode={referralCode} />}

          <div className="pt-6 mt-6 border-t border-[#222222]">
            <Button
              onClick={onReset}
              variant="outline"
              className="border-[#333333] bg-[#111111] text-white hover:bg-[#1a1a1a] text-sm font-normal"
            >
              Submit another request
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
