"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "@/lib/auth-client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Check, Key, Shield, LogOut, Github, Mail, User, Fingerprint, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { motion } from "framer-motion"
import AnimatedBackground from "@/components/animated-background"
import { createBrowserClient } from "@/lib/supabase"

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
    referralCount?: number
    hasJoinedWaitlist?: boolean
  }>({})
  
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
  }, [user, isLoading, router])
  
  // Check if user has joined the waitlist
  useEffect(() => {
    if (!user) return
    
    const checkWaitlistSubmission = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("waitlist")
          .select("referral_code, (select count(*) from waitlist as w2 where w2.referred_by = waitlist.referral_code) as referral_count")
          .eq("email", user.email)
          .single()

        if (data) {
          setReferralData({
            referralCode: data.referral_code,
            referralCount: data.referral_count || 0,
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
  
  // Check connected accounts - this is mocked for now
  // In a real app, you would fetch this data from the server
  useEffect(() => {
    if (!user) return
    
    // Mock detection of linked providers - replace with real logic based on your auth setup
    setConnectedAccounts({
      google: user.email && user.email.includes("@gmail.com"),
      github: false,
      passkey: Math.random() > 0.5, // Random mock data
    })
  }, [user])
  
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
      // This is a placeholder for passkey registration
      // You would use the passkey SDK to register a new passkey
      // await signIn.passkey.register()
      alert("Passkey registration would happen here")
      
      setConnectedAccounts(prev => ({
        ...prev,
        passkey: true
      }))
    } catch (error) {
      console.error("Error registering passkey:", error)
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
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
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
          <div className="space-y-6">
            <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-4 py-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    {user.image && <AvatarImage src={user.image} />}
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">{user.name || 'User'}</h2>
                    <p className="text-sm text-[#a0a0a0]">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
              <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
              <div className="p-2">
                <button
                  onClick={() => setCurrentTab("profile")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md ${
                    currentTab === "profile" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setCurrentTab("security")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
                    currentTab === "security" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setCurrentTab("connections")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
                    currentTab === "connections" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Connections
                </button>
                <button
                  onClick={() => setCurrentTab("waitlist")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
                    currentTab === "waitlist" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Waitlist
                </button>
              </div>
            </Card>
            
            {!referralData.hasJoinedWaitlist && (
              <Alert className="bg-amber-900/20 border-amber-600/20 text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Join our waitlist</AlertTitle>
                <AlertDescription>
                  You haven't joined our waitlist yet. Join to get early access to SafeCircle.
                </AlertDescription>
                <Button
                  variant="link"
                  className="px-0 text-amber-400"
                  asChild
                >
                  <Link href="/waitlist">Join waitlist</Link>
                </Button>
              </Alert>
            )}
          </div>          
          {/* Main content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {currentTab === "profile" && (
              <div className="mt-0 space-y-6">
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information and email address.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-1">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        defaultValue={user.name || ''}
                        className="bg-[#1a1a1a] border-[#333333]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email || ''}
                        disabled
                        className="bg-[#1a1a1a] border-[#333333]"
                      />
                      <p className="text-sm text-[#a0a0a0]">Your email address is used for login and cannot be changed.</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {/* Security Tab */}
            {currentTab === "security" && (
              <div className="mt-0 space-y-6">
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {passwordError && (
                        <Alert variant="destructive" className="bg-red-900/20 text-red-400 border-red-900/50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{passwordError}</AlertDescription>
                        </Alert>
                      )}
                      
                      {passwordSuccess && (
                        <Alert className="bg-green-900/20 text-green-400 border-green-900/50">
                          <Check className="h-4 w-4" />
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>{passwordSuccess}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="space-y-1">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="bg-[#1a1a1a] border-[#333333]"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="bg-[#1a1a1a] border-[#333333]"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-[#1a1a1a] border-[#333333]"
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="mt-4"
                      >
                        {isChangingPassword ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Changing Password...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Connections Tab */}
            {currentTab === "connections" && (
              <div className="mt-0 space-y-6">
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>
                      Link your accounts to enable seamless sign-in and enhance your account security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1a1a1a] p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="h-5 w-5 text-white">
                            <path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 18.2V20z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Email & Password</h4>
                          <p className="text-xs text-[#a0a0a0]">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="text-xs"
                      >
                        Primary
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1a1a1a] p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262" className="h-5 w-5">
                            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
                            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
                            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/>
                            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Google</h4>
                          <p className="text-xs text-[#a0a0a0]">
                            {connectedAccounts.google ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={connectedAccounts.google ? "outline" : "default"}
                        size="sm"
                        onClick={() => !connectedAccounts.google && connectProvider("google")}
                        className="text-xs"
                      >
                        {connectedAccounts.google ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1a1a1a] p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="h-5 w-5 text-white">
                            <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">GitHub</h4>
                          <p className="text-xs text-[#a0a0a0]">
                            {connectedAccounts.github ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={connectedAccounts.github ? "outline" : "default"}
                        size="sm"
                        onClick={() => !connectedAccounts.github && connectProvider("github")}
                        className="text-xs"
                      >
                        {connectedAccounts.github ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1a1a1a] p-2 rounded-md">
                          <Fingerprint className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Passkey</h4>
                          <p className="text-xs text-[#a0a0a0]">
                            {connectedAccounts.passkey ? "Registered" : "Not registered"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={connectedAccounts.passkey ? "outline" : "default"}
                        size="sm"
                        onClick={() => !connectedAccounts.passkey && registerPasskey()}
                        className="text-xs"
                      >
                        {connectedAccounts.passkey ? "Remove" : "Register"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Waitlist Tab */}
            {currentTab === "waitlist" && (
              <div className="mt-0 space-y-6">
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Waitlist Status</CardTitle>
                    <CardDescription>Check your waitlist status and share your referral link to move up in line.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {referralData.hasJoinedWaitlist ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-center bg-[#1a1a1a]/50 rounded-lg p-6">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-4">
                              <Check className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">You're on the list!</h3>
                            <p className="text-[#a0a0a0]">Thanks for joining our waitlist.</p>
                            
                            <div className="mt-6 px-6 py-3 bg-[#121212] rounded-md inline-block">
                              <div className="text-xs text-[#a0a0a0] uppercase font-semibold mb-1">Your Referral Code</div>
                              <div className="text-lg font-mono text-white">{referralData.referralCode}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#1a1a1a] p-2 rounded-full">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white">Referral Count</p>
                            </div>
                          </div>
                          <div className="text-xl font-semibold text-white">{referralData.referralCount}</div>
                        </div>
                        
                        <Link href="/waitlist" passHref>
                          <Button variant="outline" className="w-full">
                            View Referral Details
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="bg-[#1a1a1a]/50 rounded-full p-3 mb-4">
                          <AlertCircle className="h-6 w-6 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Not on the waitlist yet</h3>
                        <p className="text-[#a0a0a0] text-center mb-6">
                          Join our waitlist to get early access to SafeCircle and track your referrals.
                        </p>
                        <Link href="/waitlist" passHref>
                          <Button>Join Waitlist</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
