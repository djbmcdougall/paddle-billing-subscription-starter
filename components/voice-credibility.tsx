"use client"

import { CheckCircle, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface VoiceCredibilityProps {
  speaker: {
    name: string
    avatar: string
    initials: string
    reviewCount: number
  }
  verificationLevel: "verified" | "new" | "trusted"
  communityScore: number
  className?: string
}

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "xs" | "sm" }) => {
  const stars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === "xs" ? "w-3 h-3" : "w-4 h-4",
            i < stars
              ? "text-yellow-400 fill-current"
              : i === stars && hasHalfStar
                ? "text-yellow-400 fill-current opacity-50"
                : "text-gray-300",
          )}
        />
      ))}
    </div>
  )
}

export default function VoiceCredibility({
  speaker,
  verificationLevel,
  communityScore,
  className,
}: VoiceCredibilityProps) {
  const getBadgeVariant = () => {
    switch (verificationLevel) {
      case "verified":
        return "default"
      case "trusted":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getBadgeText = () => {
    switch (verificationLevel) {
      case "verified":
        return "Verified Voice"
      case "trusted":
        return "Trusted Voice"
      default:
        return "New Voice"
    }
  }

  return (
    <div className={cn("flex items-center space-x-3 p-3 bg-gray-50 rounded-lg", className)}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
        <AvatarFallback>{speaker.initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1">
          <span className="font-medium text-sm truncate">{speaker.name}</span>
          {verificationLevel === "verified" && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center space-x-1">
          <StarRating rating={communityScore} size="xs" />
          <span className="text-xs text-gray-500">
            {speaker.reviewCount} review{speaker.reviewCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <Badge variant={getBadgeVariant()} className="flex-shrink-0">
        {getBadgeText()}
      </Badge>
    </div>
  )
}
