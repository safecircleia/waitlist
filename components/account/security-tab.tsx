import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle, Mail, Github, Fingerprint, Globe, Clock, Laptop, Smartphone } from "lucide-react";
import { User, ConnectedAccounts, PasswordData, Session } from "./types";

interface SecurityTabProps {
  user: User;
  handlePasswordChange: (e: React.FormEvent) => void;
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordData: (data: any) => void;
  passwordError: string | null;
  passwordSuccess: string | null;
  isChangingPassword: boolean;
  connectedAccounts: {
    google: boolean;
    github: boolean;
    passkey: boolean;
  };
  connectProvider: (provider: string) => void;
  registerPasskey: () => Promise<void>;
  activeSessions: Session[];
  revokeSession: (sessionToken: string) => Promise<void>;
}

export function SecurityTab({
  user,
  handlePasswordChange,
  passwordData,
  setPasswordData,
  passwordError,
  passwordSuccess,
  isChangingPassword,
  connectedAccounts,
  connectProvider,
  registerPasskey,
  activeSessions,
  revokeSession
}: SecurityTabProps) {
  return (
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
          <div className="flex justify-between items-center">
            <CardTitle>Connected Accounts</CardTitle>
            <span className="text-[10px] px-2 py-1 bg-amber-900/30 text-amber-400 rounded-full">Coming Soon</span>
          </div>
          <CardDescription>
            Link your accounts to enable seamless sign-in and enhance your account security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div 
            className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg opacity-80"
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
            className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg opacity-80"
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
            <motion.div>
              <Button
                variant={connectedAccounts.google ? "outline" : "default"}
                size="sm"
                disabled
                className="text-xs opacity-60"
              >
                {connectedAccounts.google ? "Disconnect" : "Connect"}
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg opacity-80"
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
            <motion.div>
              <Button
                variant={connectedAccounts.github ? "outline" : "default"}
                size="sm"
                disabled
                className="text-xs opacity-60"
              >
                {connectedAccounts.github ? "Disconnect" : "Connect"}
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg opacity-80"
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
            <motion.div>
              <Button
                variant={connectedAccounts.passkey ? "outline" : "default"}
                size="sm"
                disabled
                className="text-xs opacity-60"
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
          {activeSessions.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-sm text-[#a0a0a0]">No active sessions found.</p>
            </div>
          ) : (
            activeSessions.map((session, index) => (
              <motion.div 
                key={index}
                className={`flex items-center justify-between p-4 border border-[#1a1a1a] rounded-lg ${session.current ? 'border-green-600/30' : ''}`}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(30,30,30,0.3)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`bg-[#1a1a1a] p-2 rounded-md ${session.current ? 'bg-green-900/30 text-green-400' : ''}`}>
                    {session.device.toLowerCase().includes("mobile") ? (
                      <Smartphone className="h-5 w-5" />
                    ) : (
                      <Laptop className="h-5 w-5" />
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
                {!session.current && session.sessionToken && (
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => session.sessionToken && revokeSession(session.sessionToken)}
                    >
                      Revoke
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
