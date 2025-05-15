import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "./types";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, X, Loader2 } from "lucide-react";

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [name, setName] = useState<string>(user.name);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleVerifyEmail = async () => {
    if (!user.email) return;
    setVerifying(true);
    setVerifyStatus(null);
    try {
      await client.sendVerificationEmail({
        email: user.email,
        callbackURL: "/account", // or your preferred redirect
      });
      toast.success("Verification email sent! Check your inbox for a verification link.");
      setVerifyStatus("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send verification email. Please try again later.");
      setVerifyStatus("Failed to send verification email. Please try again later.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await client.updateUser({
        image: image ? await convertImageToBase64(image) : undefined,
        name: name !== user.name ? name : undefined,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Profile updated successfully");
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
      setImage(null);
      setImagePreview(null);
    } finally {
      setIsLoading(false);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#1a1a1a] border-[#333333]"
            />
          </motion.div>

          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-end gap-4">
              {(imagePreview || user.image) && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <Image
                    src={imagePreview || user.image || ''}
                    alt="Profile preview"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-muted-foreground bg-[#1a1a1a] border-[#333333]"
                />
                {imagePreview && (
                  <X
                    className="cursor-pointer"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  />
                )}
              </div>
            </div>
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
            <Button 
              className="w-full" 
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
