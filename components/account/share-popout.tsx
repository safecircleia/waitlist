import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";

interface SharePopoutProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SharePopout({ isOpen, setIsOpen }: SharePopoutProps) {
  const [copied, setCopied] = useState(false);
  
  const shareMessage = `I just joined the SafeCircle waitlist! It's a revolutionary platform to protect childs online from childpredators. Join me and get early access: https://safecircle.ai/waitlist`;
  
  const shareUrl = `https://app.safecircle.tech/waitlist`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };
  
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareToLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareByEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent("Join me on SafeCircle!")}&body=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border border-[#1a1a1a] bg-[#0f0f0f]/95 backdrop-blur-sm text-white">
        <DialogHeader>
          <DialogTitle>Share with friends</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Invite your friends to join the waitlist.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="link" className="text-white">Share link</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="link" 
                value={shareUrl} 
                readOnly 
                className="bg-[#1a1a1a] border-[#333333] text-white"
              />
              <Button
                size="icon"
                variant="outline"
                className={copied ? "bg-green-900/20 text-green-400 border-green-900/50" : "bg-[#1a1a1a] border-[#333333]"}
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-400">Copied to clipboard!</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-white">Share to social media</Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-auto min-h-[42px] bg-[#1a1a1a] border-[#333333] hover:bg-[#1D9BF0]/10 hover:border-[#1D9BF0]/30 hover:text-[#1D9BF0] px-2 py-2"
                  onClick={shareToTwitter}
                >
                  <span className="flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mr-2">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="truncate">X (Twitter)</span>
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-auto min-h-[42px] bg-[#1a1a1a] border-[#333333] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:text-[#1877F2] px-2 py-2"
                  onClick={shareToFacebook}
                >
                  <span className="flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mr-2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="truncate">Facebook</span>
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-auto min-h-[42px] bg-[#1a1a1a] border-[#333333] hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 hover:text-[#0077B5] px-2 py-2"
                  onClick={shareToLinkedin}
                >
                  <span className="flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 mr-2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="truncate">LinkedIn</span>
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full h-auto min-h-[42px] bg-[#1a1a1a] border-[#333333] hover:bg-purple-900/20 hover:border-purple-900/30 hover:text-purple-400 px-2 py-2"
                  onClick={shareByEmail}
                >
                  <span className="flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mr-2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="truncate">Email</span>
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
          
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-purple-300">
              <span className="font-medium">Pro Tip:</span> Share the waitlist with more friends to spread our word!
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
            className="bg-[#1a1a1a] border-[#333333] hover:bg-[#2a2a2a]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
