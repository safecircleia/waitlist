import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Lock, Key, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  referralData?: {
    referralCode?: string;
    hasJoinedWaitlist?: boolean;
  };
}

export function DashboardSidebar({ activeTab, setActiveTab, user, referralData }: SidebarProps) {
  return (
    <div className="space-y-6">
      <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex flex-col items-center space-y-4 py-4">
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
        </div>
      </Card>
      <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden">
        <div className="p-2">
          <motion.button
            onClick={() => setActiveTab("waitlist")}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md ${
              activeTab === "waitlist" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Key className="h-4 w-4 mr-2" />
            Join Waitlist
          </motion.button>
          
          <motion.button
            onClick={() => setActiveTab("alpha")}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 relative overflow-hidden ${
              activeTab === "alpha" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transition-opacity duration-300 rounded-md pointer-events-none"></span>
            <span className="absolute -inset-x-2 bottom-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transform origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>
            <span className="group-hover:text-blue-300 transition-colors">Access Alpha</span>
          </motion.button>          <div className="mt-1">
            <motion.button
              onClick={() => {
                // Toggle dropdown if already in account section, otherwise navigate to account/profile
                if (activeTab === "account" || activeTab.startsWith("account/")) {
                  setActiveTab("");
                } else {
                  setActiveTab("account/profile");
                }
              }}
              className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md ${
                activeTab === "account" || activeTab === "account/profile" || activeTab === "account/security" 
                  ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
              } transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Account Settings
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-transform duration-200 ${
                  (activeTab === "account" || activeTab.startsWith("account/")) ? "rotate-90" : ""
                }`}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </motion.button>
            
            {/* Nested account navigation */}
            {(activeTab === "account" || activeTab === "account/profile" || activeTab === "account/security") && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-6 mt-1 space-y-1 overflow-hidden"
              >
                <motion.button
                  onClick={() => setActiveTab("account/profile")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === "account/profile" ? "bg-[#1a1a1a]/80" : "hover:bg-[#1a1a1a]/30"
                  } transition-colors`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <User className="h-3 w-3 mr-2" />
                  Profile
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("account/security")}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeTab === "account/security" ? "bg-[#1a1a1a]/80" : "hover:bg-[#1a1a1a]/30"
                  } transition-colors`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Lock className="h-3 w-3 mr-2" />
                  Security
                </motion.button>
              </motion.div>
            )}
          </div>
          
          <motion.button
            onClick={() => setActiveTab("donate")}
            className={`flex items-center w-full text-left px-3 py-2 rounded-md mt-1 ${
              activeTab === "donate" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Donate
          </motion.button>
        </div>
      </Card>
      
      {referralData && referralData.hasJoinedWaitlist !== true && (
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
            <Link href="/dashboard/waitlist">Join waitlist</Link>
          </Button>
        </Alert>
      )}
    </div>
  );
}
