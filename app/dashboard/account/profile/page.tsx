"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { ProfileTab } from "@/components/account/profile-tab"

export default function AccountProfilePage() {
  const { data, isPending } = useSession()
  const router = useRouter()
  const user = data?.user
  const isLoading = isPending

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }
  
  if (!user) return null

  return <ProfileTab user={user} />
}
