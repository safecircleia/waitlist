"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  
  // Redirect to the waitlist tab by default
  useEffect(() => {
    router.push('/dashboard/waitlist')
  }, [router])
  
  return null
}
