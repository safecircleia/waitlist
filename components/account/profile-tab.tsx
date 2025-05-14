import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "./types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  const handleVerifyEmail = async () => {
    if (!user.email) return;
    setVerifying(true);
    setVerifyStatus(null);
    try {
      await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/account", // or your preferred redirect
      });
      toast({
        title: "Verification email sent!",
        description: "Check your inbox for a verification link.",
      });
      setVerifyStatus("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast({
        title: "Failed to send verification email",
        description: err?.message || "Please try again later.",
      });
      setVerifyStatus("Failed to send verification email. Please try again later.");
    } finally {
      setVerifying(false);
    }
  };

  return (
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
            <div className="flex items-center gap-2 mt-1">
              {user.emailVerified ? (
                <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full font-medium">Verified</span>
              ) : (
                <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full font-medium">Not Verified</span>
              )}
            </div>
            <p className="text-sm text-[#a0a0a0]">Your email address is used for login and cannot be changed.</p>
            {user.email && !user.emailVerified && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleVerifyEmail}
                  disabled={verifying}
                >
                  {verifying ? "Sending..." : "Verify Email"}
                </Button>
                {verifyStatus && (
                  <p className={`text-xs mt-1 ${verifyStatus.startsWith('Failed') ? 'text-red-400' : 'text-green-400'}`}>{verifyStatus}</p>
                )}
              </>
            )}
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
  );
}
