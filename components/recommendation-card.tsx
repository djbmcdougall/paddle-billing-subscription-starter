"use client"

import { useState } from "react"
import Image from "next/image"
import {
  MapPin,
  ThumbsUp,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Navigation,
  ShoppingCart,
  Calendar,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import AudioPlayer from "@/components/audio-player"
import LocationDistance from "@/components/location-distance"
import CommentDialog from "@/components/comment-dialog"
import ShareDialog from "@/components/share-dialog"
import ImageCarousel from "@/components/image-carousel"
import { useSavedMurmurs } from "@/contexts/saved-murmurs-context"

interface User {
  name: string
  avatar: string
  trustScore?: number
}

interface ActionButton {
  type: "reservation" | "directions" | "purchase" | "website"
  label: string
  url?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

interface Recommendation {
  id: string
  user: User
  text: string
  location?: string | null
  coordinates?: {
    latitude: number
    longitude: number
  }
  category: string
  sentiment: "Positive" | "Negative" | "Neutral"
  image?: string
  images?: string[]
  audio: string
  reactions: {
    thumbsUp?: number
    heart?: number
    thumbsDown?: number
  }
  verified?: boolean
  verificationTypes?: string[]
  actionButton?: ActionButton
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { isSaved, saveMurmur, unsaveMurmur } = useSavedMurmurs()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Determine if text should be truncated
  const shouldTruncate = recommendation.text.length > 150
  const truncatedText =
    shouldTruncate && !isExpanded ? `${recommendation.text.substring(0, 150)}...` : recommendation.text

  // Get trust score color
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-blue-500"
    if (score >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Handle action button click
  const handleActionClick = () => {
    if (!recommendation.actionButton) return

    const { type, url, coordinates } = recommendation.actionButton

    if (type === "directions" && coordinates) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`
      window.open(mapsUrl, "_blank")
    } else if (url) {
      window.open(url, "_blank")
    }
  }

  // Get action button icon
  const getActionIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return <Calendar className="h-4 w-4" />
      case "directions":
        return <Navigation className="h-4 w-4" />
      case "purchase":
        return <ShoppingCart className="h-4 w-4" />
      case "website":
        return <ExternalLink className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  // Determine which images to show
  const imagesToShow =
    recommendation.images && recommendation.images.length > 0
      ? recommendation.images
      : recommendation.image
        ? [recommendation.image]
        : []

  return (
    <Card className="overflow-hidden">
      {imagesToShow.length > 0 && (
        <ImageCarousel images={imagesToShow} alt={`Images for ${recommendation.text.substring(0, 20)}...`} />
      )}

      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={recommendation.user.avatar || "/placeholder.svg"}
                alt={recommendation.user.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{recommendation.user.name}</p>
                  {recommendation.user.trustScore && (
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold",
                        getTrustScoreColor(recommendation.user.trustScore),
                      )}
                    >
                      {recommendation.user.trustScore}
                    </div>
                  )}
                  {recommendation.verified && <CheckCircle className="h-4 w-4 text-secondary" />}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                onClick={() =>
                  isSaved(recommendation.id) ? unsaveMurmur(recommendation.id) : saveMurmur(recommendation.id)
                }
              >
                <Bookmark
                  className={`h-4 w-4 ${isSaved(recommendation.id) ? "fill-blue-500 text-blue-500" : "text-muted-foreground"}`}
                />
              </Button>
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  recommendation.sentiment === "Positive"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-destructive text-destructive-foreground",
                )}
              >
                {recommendation.category}
              </div>
            </div>
          </div>

          {/* Audio player positioned under user profile */}
          <div className="mt-4">
            <AudioPlayer
              audioUrl={recommendation.audio}
              waveformHeight={40}
              showVolumeControl={true}
              showDuration={true}
            />

            {/* Action button positioned under audio player */}
            {recommendation.actionButton && (
              <div className="flex justify-center mt-3">
                <Button
                  onClick={handleActionClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full"
                  size="sm"
                >
                  {getActionIcon(recommendation.actionButton.type)}
                  <span className="ml-2">{recommendation.actionButton.label}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Expandable transcription */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed">{truncatedText}</p>

          {shouldTruncate && (
            <div className="flex justify-center mt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 stroke-[2.5px]" />
                ) : (
                  <ChevronDown className="h-5 w-5 stroke-[2.5px]" />
                )}
              </Button>
            </div>
          )}
        </div>

        {recommendation.location && (
          <div className="mb-4 rounded-md bg-muted p-3">
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{recommendation.location}</p>
                {recommendation.coordinates && (
                  <LocationDistance
                    latitude={recommendation.coordinates.latitude}
                    longitude={recommendation.coordinates.longitude}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-9 space-x-1 px-3">
            <ThumbsUp className="h-4 w-4" />
            <span>{recommendation.reactions.thumbsUp || 0}</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 space-x-1 px-3">
            <Heart className="h-4 w-4 text-accent" />
            <span>{recommendation.reactions.heart || 0}</span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-9 space-x-1 px-3" onClick={() => setShowComments(true)}>
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 space-x-1 px-3" onClick={() => setShowShare(true)}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        murmurId={recommendation.id}
        murmurText={recommendation.text}
        murmurUser={recommendation.user}
      />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        murmurId={recommendation.id}
        murmurText={recommendation.text}
      />
    </Card>
  )
}
