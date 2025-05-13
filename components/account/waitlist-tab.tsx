import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Key, Users, Share2 } from "lucide-react";
import Link from "next/link";
import { SharePopout } from "./share-popout";

interface WaitlistTabProps {
  referralData: {
    referralCode?: string;
    hasJoinedWaitlist?: boolean;
  };
}

export function WaitlistTab({ referralData }: WaitlistTabProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
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
            <CardTitle>Waitlist Status</CardTitle>
            <CardDescription>Check your waitlist status and share with your friends.</CardDescription>
          </motion.div>
        </CardHeader>        <CardContent>
          {referralData.hasJoinedWaitlist === true ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >              <motion.div 
                className="flex items-center justify-center bg-gradient-to-br from-[#1a1a1a]/70 to-[#2a2a2a]/50 rounded-lg p-6 overflow-hidden relative"
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px 0 rgba(0,255,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-green-500/10 to-transparent opacity-60 z-0"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwZmYwMCIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30 z-0"></div>
                <div className="text-center relative z-10">
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-400/10 border border-green-500/20 text-green-500 mb-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,0,0.3)" }}
                  >
                    <Check className="h-8 w-8" />
                  </motion.div>                  <motion.h3 
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    You're on the list!
                  </motion.h3>
                  <motion.p 
                    className="text-[#a0a0a0] px-4 md:px-8 max-w-md"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Thanks for joining our waitlist. We'll notify you when it's your turn to join SafeCircle.
                  </motion.p>
                </div>
              </motion.div>                <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6"
              >
                <Button 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/60 border border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(0,255,0,0.15)] transition-all duration-300" 
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="mr-2 h-4 w-4 text-green-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-green-300 font-medium">
                    Share SafeCircle with Friends
                  </span>
                </Button>
              </motion.div>
                {/* Share Dialog */}
              <SharePopout
                isOpen={shareDialogOpen}
                setIsOpen={setShareDialogOpen}
              />
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
              >                <Link href="/waitlist" passHref>
                  <Button size="lg">
                    <Key className="mr-2 h-4 w-4" />
                    Join Waitlist
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
            {/* Share Dialog - Available regardless of waitlist status */}
          <SharePopout
            isOpen={shareDialogOpen}
            setIsOpen={setShareDialogOpen}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
