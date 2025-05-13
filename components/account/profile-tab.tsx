import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "./types";

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
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
  );
}
