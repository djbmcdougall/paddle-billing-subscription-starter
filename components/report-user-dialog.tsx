"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Loader2 } from "lucide-react"

interface ReportUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
}

export default function ReportUserDialog({ open, onOpenChange, userId, userName }: ReportUserDialogProps) {
  const [reason, setReason] = useState<string>("")
  const [additionalInfo, setAdditionalInfo] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!reason) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to submit the report
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep Murmur safe and trustworthy.",
        variant: "success",
      })

      // Close dialog and reset form
      onOpenChange(false)
      setReason("")
      setAdditionalInfo("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-warning">
              <AlertTriangle className="h-3 w-3 text-warning-foreground" />
            </div>
            Report {userName}
          </DialogTitle>
          <DialogDescription>
            Help us understand why this user should be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="impersonation" id="impersonation" />
                <Label htmlFor="impersonation">Impersonation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate" id="inappropriate" />
                <Label htmlFor="inappropriate">Inappropriate content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam">Spam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment" id="harassment" />
                <Label htmlFor="harassment">Harassment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misinformation" id="misinformation" />
                <Label htmlFor="misinformation">Spreading misinformation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional information (optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Please provide any additional details that might help our team..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
