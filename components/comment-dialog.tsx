"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  murmurId: string
  murmurText: string
  murmurUser: {
    name: string
    avatar: string
  }
}

export default function CommentDialog({ open, onOpenChange, murmurId, murmurText, murmurUser }: CommentDialogProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to post the comment
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
        variant: "success",
      })

      // Reset and close
      setComment("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply to {murmurUser.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Original murmur */}
          <div className="flex space-x-3 p-3 rounded-md bg-muted/30">
            <Avatar className="h-10 w-10">
              <AvatarImage src={murmurUser.avatar || "/placeholder.svg"} alt={murmurUser.name} />
              <AvatarFallback>{murmurUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{murmurUser.name}</div>
              <p className="text-sm line-clamp-2">{murmurText}</p>
            </div>
          </div>

          {/* Comment input */}
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!comment.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
