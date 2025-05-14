"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { SecurityTab } from "@/components/account/security-tab"

export default function AccountSecurityPage() {
  const { data, isPending } = useSession()
  const router = useRouter()
  const user = data?.user
  const isLoading = isPending

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    github: false,
    passkey: false,
  })

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [isLoading, user, router])
  
  // Check connected accounts
  useEffect(() => {
    if (!user) return
    
    const checkConnectedAccounts = async () => {
      try {
        // This would normally check the authentication providers
        // For now, we'll simulate it
        setConnectedAccounts({
          google: false,
          github: false,
          passkey: false,
        })
      } catch (error) {
        console.error("Error checking connected accounts:", error)
      }
    }
    
    checkConnectedAccounts()
  }, [user])
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(null)
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match")
      setIsChangingPassword(false)
      return
    }
    
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordSuccess("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setPasswordError("Failed to change password")
      console.error("Error changing password:", error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const connectProvider = async (provider: string) => {
    try {
      // This would normally connect to the provider
      console.log(`Connecting to ${provider}...`)
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConnectedAccounts(prev => ({ ...prev, [provider]: true }))
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error)
    }
  }

  const registerPasskey = async () => {
    try {
      // This would normally register a passkey
      console.log("Registering passkey...")
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConnectedAccounts(prev => ({ ...prev, passkey: true }))
    } catch (error) {
      console.error("Error registering passkey:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }
  
  if (!user) return null

  return (
    <SecurityTab 
      user={user}
      handlePasswordChange={handlePasswordChange}
      passwordData={passwordData}
      setPasswordData={setPasswordData}
      passwordError={passwordError}
      passwordSuccess={passwordSuccess}
      isChangingPassword={isChangingPassword}
      connectedAccounts={connectedAccounts}
      connectProvider={connectProvider}
      registerPasskey={registerPasskey}
    />
  )
}
