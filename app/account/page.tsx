"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut, authClient } from "@/lib/auth-client"
import { createBrowserClient } from "@/lib/supabase"
import { getDeviceSessions, revokeSession } from "@/lib/session-actions"
import { BackgroundGradientAnimation } from "@/components/background"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

// Importing our components
import { ProfileTab } from "@/components/account/profile-tab"
import { SecurityTab } from "@/components/account/security-tab"
import { AlphaTab } from "@/components/account/alpha-tab"
import { WaitlistTab } from "@/components/account/waitlist-tab"
import { Sidebar } from "@/components/account/sidebar"


export default function AccountPage() {
  const router = useRouter()
  const { data, isPending } = useSession()
  const user = data?.user
  const isLoading = isPending
    const [currentTab, setCurrentTab] = useState("profile")
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  // Waitlist data
  const [referralData, setReferralData] = useState<{
    referralCode?: string
    hasJoinedWaitlist?: boolean
  }>({})
  
  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: false,
    github: false,
    passkey: false,
  })
    // Active sessions state - for the Security tab
  const [activeSessions, setActiveSessions] = useState([])
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])
  
  // Check if user has joined the waitlist
  useEffect(() => {
    if (!user) return
    
    const checkWaitlistSubmission = async () => {
      try {
        const supabase = createBrowserClient()
        // First, get the user's waitlist row
        const { data: userRow, error: userError } = await supabase
          .from("waitlist")
          .select("referral_code")
          .eq("email", user.email)
          .single()

        if (userRow && userRow.referral_code) {          setReferralData({
            referralCode: userRow.referral_code,
            hasJoinedWaitlist: true,
          })
        } else {
          setReferralData({
            hasJoinedWaitlist: false
          })
        }
      } catch (error) {
        console.error("Error checking waitlist submission:", error)
      }
    }

    checkWaitlistSubmission()
  }, [user])
    // Check connected accounts
  useEffect(() => {
    if (!user) {
      // If user is null (e.g., logged out or still loading), reset connected accounts state
      setConnectedAccounts({
        google: false,
        github: false,
        passkey: false,
      });
      return;
    }

    // Check for Google and GitHub providers in user identities
    // Assumes user.identities is an array like: [{ provider: 'google', ... }, ...]
    const hasGoogle = user.identities?.some((identity: any) => identity.provider === 'google') ?? false;
    const hasGitHub = user.identities?.some((identity: any) => identity.provider === 'github') ?? false;
    
    // Check for a verified passkey (webauthn factor)
    // Assumes user.factors is an array like: [{ factor_type: 'webauthn', status: 'verified', ... }, ...]
    const hasPasskey = user.factors?.some((factor: any) => factor.factor_type === 'webauthn' && factor.status === 'verified') ?? false;

    setConnectedAccounts({
      google: hasGoogle,
      github: hasGitHub,
      passkey: hasPasskey,
    });
  }, [user]);
  
  // Fetch active sessions
  useEffect(() => {
    if (!user) return;
    
    const fetchSessions = async () => {
      try {
        const sessions = await getDeviceSessions();
        setActiveSessions(sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    
    fetchSessions();
  }, [user]);
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset states
    setPasswordError("")
    setPasswordSuccess("")
    
    // Simple validation
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    
    setIsChangingPassword(true)
    
    try {
      // In a real app, you would call your auth API to change the password
      // This is a placeholder for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPasswordSuccess("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setPasswordError("Failed to change password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }
    const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }
  
  const connectProvider = async (provider: string) => {
    try {
      await signIn.social(
        {
          provider: provider as "google" | "github",
          callbackURL: "/account"
        },
        {
          onRequest: () => {},
          onResponse: () => {},
        }
      )
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error)
    }
  }
  const registerPasskey = async () => {
    try {
      // Use the passkey.addPasskey function from the auth client
      const result = await authClient.passkey.addPasskey();
      if (result?.error) {
        alert("Failed to register passkey: " + result.error.message);
        return;
      }
      setConnectedAccounts(prev => ({
        ...prev,
        passkey: true
      }));
      alert("Passkey registered successfully!");
    } catch (error) {
      console.error("Error registering passkey:", error);
      alert("An unexpected error occurred while registering passkey.");
    }
  }
  
  // Handle session revocation
  const handleRevokeSession = async (sessionToken: string) => {
    try {
      const success = await revokeSession(sessionToken);
      if (success) {
        // Update sessions list after revoking a session
        const updatedSessions = activeSessions.filter(
          session => session.sessionToken !== sessionToken
        );
        setActiveSessions(updatedSessions);
      }
    } catch (error) {
      console.error("Error revoking session:", error);
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }
  
  if (!user) return null
  
  return (
    <div className="min-h-screen bg-[#080808] py-10 px-4 relative">
      {/* Animated backgrounds */}
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation />
      </div>
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
            <p className="text-[#a0a0a0]">Manage your account settings and preferences.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="bg-red-900/20 hover:bg-red-900/30 text-red-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            user={user}
            referralData={referralData}
          />
          
          {/* Main content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {currentTab === "profile" && (
              <ProfileTab user={user} />
            )}
              
            {/* Security Tab */}
            {currentTab === "security" && (
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
                activeSessions={activeSessions}
                revokeSession={handleRevokeSession}
              />
            )}
              
            {/* Access Alpha Tab */}
            {currentTab === "alpha" && (
              <AlphaTab />
            )}
              
            {/* Waitlist Tab */}
            {currentTab === "waitlist" && (
              <WaitlistTab referralData={referralData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
