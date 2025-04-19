"use client"

import type React from "react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Share2, Flag, VolumeX, Ban } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCopyProfileLink } from "@/hooks/use-copy-profile-link"
import ProfileShareDialog from "./profile-share-dialog"
import ReportUserDialog from "./report-user-dialog"

interface ProfileActionMenuProps {
  userId: string
  userName: string
  isOwnProfile?: boolean
}

const ProfileActionMenu: React.FC<ProfileActionMenuProps> = ({ userId, userName, isOwnProfile = false }) => {
  const { toast } = useToast()
  const { handleCopy } = useCopyProfileLink()
  const [profileShareDialogOpen, setProfileShareDialogOpen] = useState(false)
  const [reportUserDialogOpen, setReportUserDialogOpen] = useState(false)

  const handleCopyProfileLink = () => {
    handleCopy(userId)
    toast({
      title: "Copied to clipboard",
      description: "Profile link copied to clipboard.",
    })
  }

  const handleShareProfile = () => {
    setProfileShareDialogOpen(true)
  }

  const handleMuteUser = () => {
    toast({
      title: "User muted",
      description: `You will no longer see content from ${userName}.`,
    })
  }

  const handleBlockUser = () => {
    toast({
      title: "User blocked",
      description: `You have blocked ${userName}.`,
    })
  }

  const handleReportUser = () => {
    setReportUserDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white">
            <span className="sr-only">Open user menu</span>
            <DotsHorizontalIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleShareProfile}>
            <Share2 className="mr-2 h-4 w-4" />
            Share profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyProfileLink}>Copy profile link</DropdownMenuItem>

          {!isOwnProfile && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMuteUser}>
                <VolumeX className="mr-2 h-4 w-4" />
                Mute
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlockUser}>
                <Ban className="mr-2 h-4 w-4" />
                Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReportUser} className="text-destructive focus:text-destructive">
                <Flag className="mr-2 h-4 w-4" />
                Report
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileShareDialog
        open={profileShareDialogOpen}
        onOpenChange={setProfileShareDialogOpen}
        userId={userId}
        userName={userName}
      />

      <ReportUserDialog
        open={reportUserDialogOpen}
        onOpenChange={setReportUserDialogOpen}
        userId={userId}
        userName={userName}
      />
    </>
  )
}

export default ProfileActionMenu
