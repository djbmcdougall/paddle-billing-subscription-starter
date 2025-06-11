"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import {
  ThumbsUp,
  Heart,
  Share2,
  MessageCircle,
  Flag,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mic,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import AudioWaveform from "./audio-waveform"
import PlayButton from "./play-button"
import { FlagContentDialog } from "./flag-content-dialog"
import { Toaster } from "./ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Import the dialog components
import CommentDialog from "./comment-dialog"
import ShareDialog from "./share-dialog"

// Import the Avatar component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecommendationCardProps {
  recommendation: {
    id: string
    user: {
      name: string
      avatar: string
      trustLevel?: "bronze" | "silver" | "gold" | "platinum"
    }
    text: string
    location: string | null
    coordinates?: {
      latitude: number
      longitude: number
    }
    category: string
    sentiment: string
    emotion?: "enthusiastic" | "satisfied" | "neutral" | "disappointed" | "angry"
    image: string | null
    audio?: string
    reactions: {
      thumbsUp?: number
      thumbsDown?: number
      heart?: number
    }
    verified: boolean
    verificationTypes?: Array<"voice" | "purchase" | "visit" | "photo">
  }
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFlagged, setIsFlagged] = useState(false)
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isHearted, setIsHearted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Add these state variables
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  // Add loading states for reactions
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isHeartLoading, setIsHeartLoading] = useState(false)
  const { toast } = useToast()

  // Mock audio URL if not provided
  const audioUrl = recommendation.audio || "/placeholder.mp3"

  // Determine if text should be truncated
  const shouldTruncate = recommendation.text.length > 150
  const truncatedText =
    shouldTruncate && !isExpanded ? `${recommendation.text.substring(0, 150)}...` : recommendation.text

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true)
  }

  // Add keyboard event handlers
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      action()
    }
  }

  // Update the like button handler
  const handleLike = async () => {
    setIsLikeLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsLiked(!isLiked)

      toast({
        title: isLiked ? "Removed like" : "Added like",
        description: isLiked ? "You've removed your like from this murmur" : "You've liked this murmur",
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your reaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLikeLoading(false)
    }
  }

  // Update the heart button handler
  const handleHeart = async () => {
    setIsHeartLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsHearted(!isHearted)

      toast({
        title: isHearted ? "Removed heart" : "Added heart",
        description: isHearted ? "You've removed your heart from this murmur" : "You've hearted this murmur",
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your reaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsHeartLoading(false)
    }
  }

  // Get sentiment color
  const getSentimentColor = () => {
    switch (recommendation.sentiment) {
      case "Positive":
        return "bg-success/10 border-success text-success-foreground"
      case "Negative":
        return "bg-destructive/10 border-destructive text-destructive-foreground"
      default:
        return "bg-secondary/10 border-secondary text-secondary-foreground"
    }
  }

  // Get emotion label and icon
  const getEmotionLabel = () => {
    switch (recommendation.emotion) {
      case "enthusiastic":
        return { label: "Enthusiastic", icon: "🎉" }
      case "satisfied":
        return { label: "Satisfied", icon: "😊" }
      case "neutral":
        return { label: "Neutral", icon: "😐" }
      case "disappointed":
        return { label: "Disappointed", icon: "😕" }
      case "angry":
        return { label: "Angry", icon: "😠" }
      default:
        return null
    }
  }

  // Get trust level badge
  const getTrustLevelBadge = () => {
    switch (recommendation.user.trustLevel) {
      case "bronze":
        return { label: "Bronze", icon: "🥉", color: "bg-amber-700/20 text-amber-700" }
      case "silver":
        return { label: "Silver", icon: "🥈", color: "bg-gray-400/20 text-gray-600" }
      case "gold":
        return { label: "Gold", icon: "🥇", color: "bg-yellow-400/20 text-yellow-700" }
      case "platinum":
        return { label: "Platinum", icon: "💎", color: "bg-cyan-400/20 text-cyan-700" }
      default:
        return null
    }
  }

  const emotion = getEmotionLabel()
  const trustLevel = getTrustLevelBadge()

  return (
    <>
      <Card className={cn("overflow-hidden bg-card shadow-blue-sm border-muted", getSentimentColor())}>
        {recommendation.image && !imageError ? (
          <div className="relative h-48 w-full bg-muted">
            <Image
              src={recommendation.image || "/placeholder.svg"}
              alt={`Image for ${recommendation.text.substring(0, 20)}...`}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </div>
        ) : recommendation.image ? (
          <div className="h-48 w-full bg-muted flex items-center justify-center text-muted-foreground">
            Image not available
          </div>
        ) : null}

        <CardContent className="p-4">
          {/* User info and verification badges */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage
                    src={recommendation.user.avatar || "/placeholder.svg?height=48&width=48&text=User"}
                    alt={recommendation.user.name}
                    onError={(e) => {
                      // Fallback for avatar errors
                      e.currentTarget.src = `/placeholder.svg?height=48&width=48&text=${recommendation.user.name.charAt(0)}`
                    }}
                  />
                  <AvatarFallback>{recommendation.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {trustLevel && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                    <span className="text-xs">{trustLevel.icon}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-medium text-lg">{recommendation.user.name}</span>
                  {recommendation.verified && <CheckCircle className="ml-1 h-4 w-4 text-primary" />}
                </div>
                {trustLevel && (
                  <Badge variant="outline" className={cn("text-xs", trustLevel.color)}>
                    Trust Level: {trustLevel.label}
                  </Badge>
                )}
              </div>
            </div>
            <div
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium",
                recommendation.sentiment === "Positive"
                  ? "bg-success/20 text-success-foreground"
                  : recommendation.sentiment === "Negative"
                    ? "bg-destructive/20 text-destructive-foreground"
                    : "bg-secondary/20 text-secondary-foreground",
              )}
            >
              {recommendation.category}
            </div>
          </div>

          {/* Verification badges */}
          {recommendation.verificationTypes && recommendation.verificationTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {recommendation.verificationTypes.includes("voice") && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <Mic className="mr-1 h-3 w-3" /> Voice Verified
                </Badge>
              )}
              {recommendation.verificationTypes.includes("purchase") && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  <CheckCircle className="mr-1 h-3 w-3" /> Purchase Confirmed
                </Badge>
              )}
              {recommendation.verificationTypes.includes("visit") && (
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                  <CheckCircle className="mr-1 h-3 w-3" /> Visit Verified
                </Badge>
              )}
            </div>
          )}

          {/* Audio player with enhanced waveform */}
          <div className="mb-4 p-3 rounded-md bg-background/80 shadow-sm">
            <div className="flex items-center gap-3">
              <PlayButton
                onToggle={(playing) => setIsPlaying(playing)}
                size="md"
                className="bg-primary border-primary text-white"
              />
              <div className="flex-1">
                <AudioWaveform
                  audioUrl={audioUrl}
                  isPlaying={isPlaying}
                  height={50}
                  barColor={
                    recommendation.sentiment === "Positive"
                      ? "#B8E1DD"
                      : recommendation.sentiment === "Negative"
                        ? "#F3BDB5"
                        : "#DADBE9"
                  }
                  progressColor={
                    recommendation.sentiment === "Positive"
                      ? "#7B91C9"
                      : recommendation.sentiment === "Negative"
                        ? "#F3BDB5"
                        : "#7B91C9"
                  }
                  useGradient={true}
                  showRealTimeVisualization={true}
                />
              </div>
            </div>
          </div>

          {/* Emotion tag */}
          {emotion && (
            <div className="mb-3">
              <Badge variant="outline" className="bg-muted/50">
                <span className="mr-1">{emotion.icon}</span> {emotion.label} Tone
              </Badge>
            </div>
          )}

          {/* Content text */}
          <div className="mb-2">
            <p className="text-foreground">{truncatedText}</p>

            {shouldTruncate && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full hover:bg-muted/50"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 stroke-[2.5px] text-accent" />
                  ) : (
                    <ChevronDown className="h-5 w-5 stroke-[2.5px] text-accent" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-muted p-4">
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 space-x-2 px-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={handleLike}
              disabled={isLikeLoading}
              onKeyDown={(e) => handleKeyDown(e, handleLike)}
              aria-label={isLiked ? "Unlike this murmur" : "Like this murmur"}
              aria-pressed={isLiked}
            >
              {isLikeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ThumbsUp className={cn("h-5 w-5", isLiked ? "text-primary" : "text-muted-foreground")} />
              )}
              <span className={isLiked ? "text-primary" : "text-muted-foreground"}>
                {isLiked && recommendation.reactions.thumbsUp
                  ? recommendation.reactions.thumbsUp + 1
                  : recommendation.reactions.thumbsUp}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 space-x-2 px-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={handleHeart}
              disabled={isHeartLoading}
              onKeyDown={(e) => handleKeyDown(e, handleHeart)}
              aria-label={isHearted ? "Remove heart from this murmur" : "Heart this murmur"}
              aria-pressed={isHearted}
            >
              {isHeartLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={cn("h-5 w-5", isHearted ? "text-destructive" : "text-muted-foreground")} />
              )}
              <span className={isHearted ? "text-destructive" : "text-muted-foreground"}>
                {isHearted && recommendation.reactions.heart
                  ? recommendation.reactions.heart + 1
                  : recommendation.reactions.heart}
              </span>
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setCommentDialogOpen(true)}
              aria-label="Comment on this murmur"
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setShareDialogOpen(true)}
              aria-label="Share this murmur"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isFlagged && "text-warning",
              )}
              onClick={() => setFlagDialogOpen(true)}
              aria-label="Flag this murmur"
              aria-pressed={isFlagged}
            >
              <Flag className={cn("h-5 w-5", isFlagged ? "text-warning" : "text-muted-foreground")} />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <FlagContentDialog
        open={flagDialogOpen}
        onOpenChange={(open) => {
          setFlagDialogOpen(open)
          if (!open && !isFlagged) {
            setIsFlagged(true)
          }
        }}
        contentId={recommendation.id}
      />

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        murmurId={recommendation.id}
        murmurText={recommendation.text}
        murmurUser={recommendation.user}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        murmurId={recommendation.id}
        murmurText={recommendation.text}
      />

      <Toaster />
    </>
  )
}
