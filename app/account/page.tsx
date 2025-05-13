"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "@/lib/auth-client"
import { createBrowserClient } from "@/lib/supabase"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Check, Key, Shield, LogOut, Github, Mail, User, Fingerprint, Lock, Users, Clock, Globe, Smartphone, Laptop, ExternalLink, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { motion } from "framer-motion"
import AnimatedBackground from "@/components/animated-background"

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
  const [activeSessions, setActiveSessions] = useState([
    { 
      device: "Chrome on Windows", 
      location: "San Francisco, US", 
      lastActive: "Just now", 
      current: true 
    },
    { 
      device: "Safari on iPhone", 
      location: "New York, US", 
      lastActive: "2 hours ago", 
      current: false 
    }
  ])
  
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
      const authClient = createBrowserClient();
      const { data, error } = await authClient.passkey.addPasskey();
      if (error) {
        alert("Failed to register passkey: " + error.message);
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
              <CardContent className="p-4">                <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="relative overflow-hidden w-24 h-24 rounded-full">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                        {user.image && <AvatarImage src={user.image} className="object-cover" />}
                      </Avatar>
                    </div>
                    
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-white">{user.name || 'User'}</h2>
                      <p className="text-sm text-[#a0a0a0]">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
            </Card>
              <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">              <div className="p-2">
                <motion.button
                  onClick={() => setCurrentTab("profile")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md ${
                    currentTab === "profile" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </motion.button>
                <motion.button
                  onClick={() => setCurrentTab("security")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
                    currentTab === "security" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </motion.button>
                <motion.button
                  onClick={() => setCurrentTab("waitlist")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
                    currentTab === "waitlist" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Waitlist
                </motion.button>
                <motion.button
                  onClick={() => setCurrentTab("alpha")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
                    currentTab === "alpha" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>
                  Access Alpha
                </motion.button>
              </div>
            </Card>
            
            {!referralData.hasJoinedWaitlist && (              <Alert className="bg-amber-900/20 border-amber-600/20 text-amber-400">
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
          <div className="space-y-6">            {/* Profile Tab */}
            {currentTab === "profile" && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-0 space-y-6"
              >
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your profile information and email address.</CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div 
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        defaultValue={user.name || ''}
                        className="bg-[#1a1a1a] border-[#333333]"
                      />
                    </motion.div>
                    <motion.div 
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email || ''}
                        disabled
                        className="bg-[#1a1a1a] border-[#333333]"
                      />
                      <p className="text-sm text-[#a0a0a0]">Your email address is used for login and cannot be changed.</p>
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button className="w-full">Save changes</Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
              {/* Security Tab */}
            {currentTab === "security" && (
              <div className="mt-0 space-y-6">
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({...passwordData, currentPassword: e.target.value})}
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({...passwordData, newPassword: e.target.value})}
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-[#1a1a1a] border-[#333333]"
                          required
                        />
                      </div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                          className="mt-4 w-full"
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
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>
                      Link your accounts to enable seamless sign-in and enhance your account security.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div 
                      className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg"
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(30,30,30,0.3)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1a1a1a] p-2 rounded-md">
                          <Mail className="h-5 w-5 text-white" />
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
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg"
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(30,30,30,0.3)' }}
                      transition={{ duration: 0.2 }}
                    >
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
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          variant={connectedAccounts.google ? "outline" : "default"}
                          size="sm"
                          onClick={() => !connectedAccounts.google && connectProvider("google")}
                          className="text-xs"
                        >
                          {connectedAccounts.google ? "Disconnect" : "Connect"}
                        </Button>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg"
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(30,30,30,0.3)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#1a1a1a] p-2 rounded-md">
                          <Github className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">GitHub</h4>
                          <p className="text-xs text-[#a0a0a0]">
                            {connectedAccounts.github ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          variant={connectedAccounts.github ? "outline" : "default"}
                          size="sm"
                          onClick={() => !connectedAccounts.github && connectProvider("github")}
                          className="text-xs"
                        >
                          {connectedAccounts.github ? "Disconnect" : "Connect"}
                        </Button>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg"
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(30,30,30,0.3)' }}
                      transition={{ duration: 0.2 }}
                    >
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
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          variant={connectedAccounts.passkey ? "outline" : "default"}
                          size="sm"
                          onClick={() => !connectedAccounts.passkey && registerPasskey()}
                          className="text-xs"
                        >
                          {connectedAccounts.passkey ? "Remove" : "Register"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
                
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                      View and manage your active sessions across different devices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeSessions.map((session, index) => (
                      <motion.div 
                        key={index}
                        className={`flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg ${session.current ? 'border-green-600/30' : ''}`}
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(30,30,30,0.3)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`bg-[#1a1a1a] p-2 rounded-md ${session.current ? 'bg-green-900/30 text-green-400' : ''}`}>
                            {session.device.includes("Chrome") ? (
                              <Laptop className="h-5 w-5" />
                            ) : (
                              <Smartphone className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-white">{session.device}</h4>
                              {session.current && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded-full">Current</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#a0a0a0]">
                              <Globe className="h-3 w-3" />
                              <span>{session.location}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{session.lastActive}</span>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <motion.div whileTap={{ scale: 0.97 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              Revoke
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
              {/* Access Alpha Tab */}
            {currentTab === "alpha" && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-0 space-y-6"
              >
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      <CardTitle>SafeCircle Alpha Access</CardTitle>
                      <CardDescription>Get exclusive early access to our secure communication platform.</CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="flex flex-col items-center justify-center text-center py-8 px-4 bg-gradient-to-br from-[#1a1a1a]/50 to-[#2a2a2a]/30 rounded-xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <motion.div 
                        className="relative mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-75 blur-lg"></div>
                        <div className="p-4 bg-[#1a1a1a] rounded-full relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-400">
                            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 5c.34-.27.74-.5 1.2-.6"/>
                            <path d="M14 2v4"/>
                            <path d="M18 5V2"/>
                            <path d="M22 8V2"/>
                          </svg>
                        </div>
                      </motion.div>
                      
                      <motion.h2 
                        className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Coming Soon!
                      </motion.h2>
                      
                      <motion.p 
                        className="text-[#a0a0a0] mb-6 max-w-md"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Hey there! 👋 The Alpha version of SafeCircle isn't quite ready yet, but we're working our butts off to get it to you ASAP! 
                      </motion.p>
                      
                      <motion.p 
                        className="text-[#a0a0a0] mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        Follow us on Twitter for the latest updates and be the first to know when we launch!
                      </motion.p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <a 
                          href="https://x.com/safecircleai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#1D9BF0] text-white px-5 py-2 rounded-lg font-medium transition-all hover:bg-[#1a8cd8]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          Follow @safecircleai
                        </a>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="mt-8 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-full mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-400 mb-1">What to expect in the Alpha</h4>
                          <ul className="text-xs text-[#a0a0a0] space-y-1 list-disc list-inside">
                            <li>End-to-end encrypted messaging</li>
                            <li>Secure file sharing</li>
                            <li>Private group conversations</li>
                            <li>Cross-platform compatibility</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <motion.div 
                      className="w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Link href="/waitlist" passHref className="w-full block">
                        <Button variant="outline" className="w-full">
                          <Key className="mr-2 h-4 w-4" />
                          Join the Waitlist for Priority Access
                        </Button>
                      </Link>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
              {/* Waitlist Tab */}
            {currentTab === "waitlist" && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-0 space-y-6"
              >
                <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      <CardTitle>Waitlist Status</CardTitle>
                      <CardDescription>Check your waitlist status and share with your friends.</CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    {referralData.hasJoinedWaitlist ? (
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="flex items-center justify-center bg-gradient-to-br from-[#1a1a1a]/50 to-[#2a2a2a]/30 rounded-lg p-6"
                          whileHover={{ scale: 1.02, boxShadow: "0 0 15px 0 rgba(0,255,0,0.05)" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-center">
                            <motion.div 
                              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                            >
                              <Check className="h-8 w-8" />
                            </motion.div>
                            <motion.h3 
                              className="text-xl font-semibold text-white mb-2"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              You're on the list!
                            </motion.h3>
                            <motion.p 
                              className="text-[#a0a0a0]"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              Thanks for joining our waitlist.
                            </motion.p>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link href="/waitlist" passHref className="w-full block">
                            <Button variant="outline" className="w-full">
                              <Users className="mr-2 h-4 w-4" />
                              Share SafeCircle with Friends
                            </Button>
                          </Link>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="flex flex-col items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="bg-[#1a1a1a]/50 rounded-full p-4 mb-4"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        >
                          <AlertCircle className="h-8 w-8 text-amber-500" />
                        </motion.div>
                        <motion.h3 
                          className="text-xl font-semibold text-white mb-2"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          Not on the waitlist yet
                        </motion.h3>
                        <motion.p 
                          className="text-[#a0a0a0] text-center mb-6"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          Join our waitlist to get early access to SafeCircle and be among the first to experience our secure communication platform.
                        </motion.p>
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link href="/waitlist" passHref>
                            <Button size="lg">
                              <Key className="mr-2 h-4 w-4" />
                              Join Waitlist
                            </Button>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
