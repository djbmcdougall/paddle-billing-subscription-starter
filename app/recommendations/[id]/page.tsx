"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  MapPin,
  ThumbsUp,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import MapView from "@/components/map-view"
import LocationDistance from "@/components/location-distance"
import AudioPlayer from "@/components/audio-player"

export default function RecommendationDetailPage({ params }: { params: { id: string } }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock data for a single recommendation
  const recommendation = {
    id: params.id,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    },
    text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. Definitely recommend their caramel latte! The pastries were also fresh and delicious. I spent a few hours working there and the WiFi was fast and reliable. The prices are reasonable for the quality you get. I'll definitely be coming back regularly.",
    location: "Brew & Bean Coffee Shop",
    address: "123 Main St, San Francisco, CA",
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    category: "Food & Drink",
    sentiment: "Positive",
    image: "/placeholder.svg?height=300&width=400&text=Coffee+Shop",
    audio: "/placeholder.mp3", // Mock audio URL
    reactions: {
      thumbsUp: 24,
      heart: 12,
    },
    verified: true,
    comments: [
      {
        id: "1",
        user: {
          name: "Mike Chen",
          avatar: "/placeholder.svg?height=32&width=32&text=MC",
        },
        text: "I tried their caramel latte based on your recommendation and it was amazing! Thanks for sharing!",
        timestamp: "2 days ago",
      },
      {
        id: "2",
        user: {
          name: "Emily Rodriguez",
          avatar: "/placeholder.svg?height=32&width=32&text=ER",
        },
        text: "Did you try their blueberry muffins? They're my favorite!",
        timestamp: "1 day ago",
      },
    ],
  }

  // Determine if text should be truncated
  const shouldTruncate = recommendation.text.length > 150
  const truncatedText =
    shouldTruncate && !isExpanded ? `${recommendation.text.substring(0, 150)}...` : recommendation.text

  return (
    <div className="container max-w-2xl px-4 py-6 pb-20">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </div>

      <Card className="overflow-hidden">
        {recommendation.image && (
          <div className="relative h-64 w-full">
            <Image
              src={recommendation.image || "/placeholder.svg"}
              alt={`Image for ${recommendation.text.substring(0, 20)}...`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardContent className="p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={recommendation.user.avatar || "/placeholder.svg"}
                  alt={recommendation.user.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{recommendation.user.name}</p>
                    {recommendation.verified && <CheckCircle className="ml-1 h-4 w-4 text-secondary" />}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>
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

            {/* Audio player positioned under user profile */}
            <div className="mt-4">
              <AudioPlayer
                audioUrl={recommendation.audio}
                waveformHeight={40}
                showVolumeControl={true}
                showDuration={true}
              />
            </div>
          </div>

          {/* Expandable transcription */}
          <div className="mb-4">
            <p className="text-base leading-relaxed">{truncatedText}</p>

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
            <div className="mb-6 space-y-4">
              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{recommendation.location}</p>
                    <p className="text-xs text-muted-foreground">{recommendation.address}</p>
                    <LocationDistance
                      latitude={recommendation.coordinates.latitude}
                      longitude={recommendation.coordinates.longitude}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <MapView
                latitude={recommendation.coordinates.latitude}
                longitude={recommendation.coordinates.longitude}
                name={recommendation.location}
                className="h-48 w-full"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9 space-x-1 px-3">
              <ThumbsUp className="h-4 w-4" />
              <span>{recommendation.reactions.thumbsUp}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 space-x-1 px-3">
              <Heart className="h-4 w-4 text-accent" />
              <span>{recommendation.reactions.heart}</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9 space-x-1 px-3">
              <MessageCircle className="h-4 w-4" />
              <span>{recommendation.comments.length}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 space-x-1 px-3">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold">Comments</h2>

        <div className="space-y-4">
          {recommendation.comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center space-x-2">
                <Image
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{comment.user.name}</p>
                  <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                </div>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Image
            src="/placeholder.svg?height=32&width=32&text=YO"
            alt="Your avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full rounded-full border bg-background px-4 py-2 pr-12 text-sm"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
