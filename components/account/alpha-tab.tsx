import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Lock, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AlphaTab() {
  const [accessCode, setAccessCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "error" | "success">("none");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerifyCode = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      
      if (accessCode.startsWith("SC-")) {
        setVerificationStatus("error");
        setErrorMessage("Invalid access code. Please try again or contact support.");
      } else {
        setVerificationStatus("error");
        setErrorMessage("Access codes must start with SC-");
      }
    }, 1500);
  };

  const resetForm = () => {
    setAccessCode("");
    setVerificationStatus("none");
    setErrorMessage("");
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
            <CardTitle>SafeCircle Alpha Access</CardTitle>
            <CardDescription>Enter your exclusive access code to unlock SafeCircle Alpha.</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          {verificationStatus === "none" ? (            <motion.div 
              className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[#1a1a1a] rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            ><motion.div 
                className="relative mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-4 bg-[#1a1a1a] rounded-full relative border border-[#333333]">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </motion.div>
                <motion.h2 
                className="text-2xl font-bold mb-2 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Unlock Alpha Access
              </motion.h2>
              
              <motion.p 
                className="text-[#a0a0a0] mb-6 max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Enter your exclusive access code starting with "SC-" to gain early access to our platform.
              </motion.p>
              
              <motion.div
                className="w-full max-w-md space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >                <div className="relative">
                  <Input
                    type="text"
                    placeholder="SC-XXXXXX"
                    className="bg-[#1a1a1a] border-[#333333] text-white relative pl-10 h-12 text-lg tracking-wider"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                </div>
                  <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full h-12 text-lg font-medium"
                    onClick={handleVerifyCode}
                    disabled={isVerifying || accessCode.length < 4}
                  >
                    {isVerifying ? (
                      <motion.div
                        className="flex items-center space-x-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                        <span>Verifying...</span>
                      </motion.div>
                    ) : (
                      "Verify Access Code"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : verificationStatus === "error" ? (            <motion.div
              className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[#1a1a1a] rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <div className="absolute -inset-0.5 rounded-full bg-red-500 opacity-30 blur-lg"></div>
                <div className="p-4 bg-[#1a1a1a] rounded-full relative border border-red-500/30">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold mb-2 text-red-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Access Denied
              </motion.h2>
              
              <motion.p
                className="text-[#a0a0a0] mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {errorMessage}
              </motion.p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={resetForm} className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white">
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          ) : (            <motion.div
              className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[#1a1a1a] rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <div className="absolute -inset-0.5 rounded-full bg-green-500 opacity-30 blur-lg"></div>
                <div className="p-4 bg-[#1a1a1a] rounded-full relative border border-green-500/30">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold mb-2 text-green-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Access Granted
              </motion.h2>
              
              <motion.p
                className="text-[#a0a0a0] mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome to SafeCircle Alpha! You now have full access to our platform.
              </motion.p>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 text-sm text-[#a0a0a0]">
              <ShieldAlert className="h-4 w-4 mr-2 text-purple-400" />
              No access code? Join our waitlist to get one when available.
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
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
  );
}
