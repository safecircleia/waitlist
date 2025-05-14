import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Lock, Key, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TopNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  referralData: {
    referralCode?: string;
    hasJoinedWaitlist?: boolean;
  };
}

export function TopNav({ currentTab, setCurrentTab, user, referralData }: TopNavProps) {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm w-full md:w-auto">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
                {user.image && <AvatarImage src={user.image} className="object-cover" />}
              </Avatar>
              
              <div>
                <h2 className="text-lg font-semibold text-white">{user.name || 'User'}</h2>
                <p className="text-sm text-[#a0a0a0]">{user.email}</p>
              </div>
            </div>
          </div>
        </Card>
        
        {referralData.hasJoinedWaitlist !== true && (
          <Alert className="bg-amber-900/20 border-amber-600/20 text-amber-400 w-full md:max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Join our waitlist</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Get early access to SafeCircle.</span>
              <Button
                variant="link"
                className="px-0 text-amber-400"
                asChild
              >
                <Link href="/dashboard/waitlist">Join waitlist</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Card className="border border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-sm overflow-hidden w-full">
        <div className="flex flex-row flex-wrap md:flex-nowrap">
          <motion.button
            onClick={() => setCurrentTab("profile")}
            className={`flex items-center justify-center md:justify-start flex-grow md:flex-grow-0 px-4 py-3 text-center md:text-left ${
              currentTab === "profile" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <User className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Profile</span>
          </motion.button>
          <motion.button
            onClick={() => setCurrentTab("security")}
            className={`flex items-center justify-center md:justify-start flex-grow md:flex-grow-0 px-4 py-3 text-center md:text-left ${
              currentTab === "security" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lock className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Security</span>
          </motion.button>
          <motion.button
            onClick={() => setCurrentTab("waitlist")}
            className={`flex items-center justify-center md:justify-start flex-grow md:flex-grow-0 px-4 py-3 text-center md:text-left ${
              currentTab === "waitlist" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Key className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Waitlist</span>
          </motion.button>
          <motion.button
            onClick={() => setCurrentTab("alpha")}
            className={`flex items-center justify-center md:justify-start flex-grow md:flex-grow-0 px-4 py-3 text-center md:text-left relative overflow-hidden ${
              currentTab === "alpha" ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
            } transition-colors group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transition-opacity duration-300 pointer-events-none"></span>
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transform origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/>
              <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/>
              <path d="M15 2v5h5"/>
            </svg>
            <span className="hidden md:inline group-hover:text-blue-300 transition-colors">Access Alpha</span>
          </motion.button>
        </div>
      </Card>
    </div>
  );
}
