"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Settings, Users } from "lucide-react"
import RecommendationCard from "@/components/recommendation-card"
import { useAuth } from "@/contexts/auth-context"
import CreateMurmurButton from "@/components/create-murmur-button"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [avatarError, setAvatarError] = useState(false)

  // Mock data for user profile
  const profile = {
    name: user?.name || "Alex Morgan",
    avatar: user?.avatar || "/placeholder.svg?height=120&width=120&text=AM",
    bio: "Food enthusiast | Travel lover | Always looking for the next great experience",
    location: "San Francisco, CA",
    countryFlag: user?.countryFlag || "🇺🇸",
    language: user?.language || "English",
    showCountryFlag: user?.preferences?.displaySettings?.showCountryFlag ?? true,
    stats: {
      recommendations: 42,
      listeners: 156,
      listening: 89,
    },
  }

  // Mock data for recommendations (reusing from homepage)
  const recommendations = [
    {
      id: "1",
      user: {
        name: profile.name,
        avatar: profile.avatar,
      },
      text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. Definitely recommend their caramel latte! The pastries were also fresh and delicious. I spent a few hours working there and the WiFi was fast and reliable. The prices are reasonable for the quality you get. I'll definitely be coming back regularly.",
      location: "Brew & Bean Coffee Shop",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      category: "Food & Drink",
      sentiment: "Positive",
      image: "/placeholder.svg?height=300&width=400&text=Coffee+Shop",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 24,
        heart: 12,
      },
      verified: true,
    },
    {
      id: "2",
      user: {
        name: profile.name,
        avatar: profile.avatar,
      },
      text: "The new hiking trail at Evergreen Park is absolutely stunning! Great views and well-maintained paths. Perfect for a weekend adventure. I went there last Saturday and was amazed by the natural beauty. The trail is about 5 miles long with moderate difficulty, so it's suitable for most hikers. There are several lookout points along the way with breathtaking views of the valley and mountains beyond.",
      location: "Evergreen Park",
      coordinates: {
        latitude: 37.7694,
        longitude: -122.4862,
      },
      category: "Outdoors",
      sentiment: "Positive",
      image: "/placeholder.svg?height=300&width=400&text=Hiking+Trail",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 18,
        heart: 9,
      },
      verified: true,
    },
  ]

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const handleAvatarError = () => {
    setAvatarError(true)
  }

  return (
    <div className="pb-16">
      <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 to-primary/40">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={handleSettingsClick}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="container px-4">
        <div className="relative -mt-16 mb-6 flex flex-col items-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden flex items-center justify-center">
              {!avatarError ? (
                <Image
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                  onError={handleAvatarError}
                />
              ) : (
                <span className="text-4xl font-bold">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            {profile.showCountryFlag && profile.countryFlag && (
              <div className="absolute -right-2 bottom-3 h-8 w-8 rounded-full bg-background flex items-center justify-center text-xl">
                {profile.countryFlag}
              </div>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold">{profile.name}</h1>

          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{profile.location}</span>
            {profile.showCountryFlag && profile.language && (
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">{profile.language}</span>
            )}
          </div>

          <p className="mt-2 text-center text-sm">{profile.bio}</p>

          <div className="mt-4 flex w-full justify-center space-x-6">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.stats.recommendations}</span>
              <span className="text-xs text-muted-foreground">Murmurs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.stats.listeners}</span>
              <span className="text-xs text-muted-foreground">Listeners</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.stats.listening}</span>
              <span className="text-xs text-muted-foreground">Listening</span>
            </div>
          </div>

          <Button className="mt-4 flex items-center bg-purple-600 hover:bg-purple-700 text-white">
            <Users className="mr-2 h-4 w-4" />
            Listen
          </Button>
        </div>

        <Tabs defaultValue="murmurs" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="murmurs">Murmurs</TabsTrigger>
            <TabsTrigger value="listening">Listening</TabsTrigger>
          </TabsList>
          <TabsContent value="murmurs" className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="listening" className="mt-6">
            <Card className="flex h-40 items-center justify-center text-muted-foreground">
              You haven't listened to anyone yet.
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <CreateMurmurButton />
    </div>
  )
}
