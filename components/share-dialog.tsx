"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Facebook, Twitter, Mail, MessageSquare, Copy, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  murmurId: string
  murmurText: string
}

export default function ShareDialog({ open, onOpenChange, murmurId, murmurText }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState<string | null>(null)
  const { toast } = useToast()

  // Generate share URL
  const shareUrl = `https://murmur.app/murmur/${murmurId}`

  // Generate share text
  const shareText = `${murmurText.substring(0, 100)}${murmurText.length > 100 ? "..." : ""} - via Murmur`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)

      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
        variant: "success",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (platform: string) => {
    setIsSharing(platform)

    try {
      // In a real app, these would use the Web Share API or platform-specific SDKs
      await new Promise((resolve) => setTimeout(resolve, 800))

      let shareLink = ""

      switch (platform) {
        case "whatsapp":
          shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          break
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
          break
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
          break
        case "email":
          shareLink = `mailto:?subject=Check out this Murmur&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          break
      }

      if (shareLink) {
        window.open(shareLink, "_blank")
      }

      toast({
        title: "Shared successfully",
        description: `Content shared to ${platform}`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share to the selected platform",
        variant: "destructive",
      })
    } finally {
      setIsSharing(null)
    }
  }

  const shareOptions = [
    { id: "whatsapp", name: "WhatsApp", icon: MessageSquare, color: "bg-green-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-sky-500" },
    { id: "email", name: "Email", icon: Mail, color: "bg-gray-600" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share this Murmur</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {shareOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="flex items-center justify-center space-x-2 h-12"
                onClick={() => handleShare(option.id)}
                disabled={isSharing === option.id}
              >
                <div className={cn("p-1.5 rounded-full text-white", option.color)}>
                  {isSharing === option.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <option.icon className="h-4 w-4" />
                  )}
                </div>
                <span>{option.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
