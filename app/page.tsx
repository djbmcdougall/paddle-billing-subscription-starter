"use client"

import Header from "@/components/header"
import RecommendationCard from "@/components/recommendation-card"
import { Button } from "@/components/ui/button"
import CategoryIcon from "@/components/category-icon"
import CreateMurmurButton from "@/components/create-murmur-button"
import { useState, useEffect } from "react"
import RecommendationSkeleton from "@/components/recommendation-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  // Mock data for recommendations with real faces, images, coordinates
  const recommendations = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
        trustLevel: "gold",
      },
      text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. Definitely recommend their caramel latte! The pastries were also fresh and delicious. I spent a few hours working there and the WiFi was fast and reliable. The prices are reasonable for the quality you get. I'll definitely be coming back regularly.",
      location: "Brew & Bean Coffee Shop",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      category: "Food & Drink",
      sentiment: "Positive",
      emotion: "enthusiastic",
      image: "/placeholder.svg?height=300&width=400&text=Coffee+Shop",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 24,
        heart: 12,
      },
      verified: true,
      verificationTypes: ["voice", "purchase", "visit"],
    },
    {
      id: "2",
      user: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40&text=MC",
        trustLevel: "silver",
      },
      text: "The new hiking trail at Evergreen Park is absolutely stunning! Great views and well-maintained paths. Perfect for a weekend adventure. I went there last Saturday and was amazed by the natural beauty. The trail is about 5 miles long with moderate difficulty, so it's suitable for most hikers. There are several lookout points along the way with breathtaking views of the valley and mountains beyond. I'd recommend going early in the morning to avoid crowds and catch the beautiful morning light.",
      location: "Evergreen Park",
      coordinates: {
        latitude: 37.7694,
        longitude: -122.4862,
      },
      category: "Outdoors",
      sentiment: "Positive",
      emotion: "satisfied",
      image: "/placeholder.svg?height=300&width=400&text=Hiking+Trail",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 18,
        heart: 9,
      },
      verified: true,
      verificationTypes: ["voice", "visit"],
    },
    {
      id: "3",
      user: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40&text=ER",
        trustLevel: "bronze",
      },
      text: 'Just finished reading "The Midnight Library" and it was such a thought-provoking book. The character development was incredible! The story follows Nora Seed who finds herself in a library between life and death, with each book representing a different version of her life. It really makes you think about the choices we make and the ripple effects they have. The author does an amazing job of weaving philosophy into an engaging narrative. Highly recommend for anyone looking for a meaningful read.',
      location: null,
      category: "Books",
      sentiment: "Positive",
      emotion: "enthusiastic",
      image: "/placeholder.svg?height=300&width=400&text=Book+Cover",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 32,
        heart: 15,
      },
      verified: false,
      verificationTypes: ["voice"],
    },
    {
      id: "4",
      user: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40&text=DK",
      },
      text: "The service at Tech Gadgets was disappointing. Waited for 30 minutes and the staff wasn't knowledgeable about the products. When I finally got help, the employee couldn't answer basic questions about the laptop specs and kept checking their phone. The store was also disorganized with items in the wrong places. I ended up leaving without making a purchase and found a much better experience at another store. Would not recommend if you're looking for informed tech advice.",
      location: "Tech Gadgets Store",
      coordinates: {
        latitude: 37.7831,
        longitude: -122.4039,
      },
      category: "Shopping",
      sentiment: "Negative",
      emotion: "disappointed",
      image: "/placeholder.svg?height=300&width=400&text=Electronics+Store",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsDown: 8,
        thumbsUp: 2,
      },
      verified: true,
      verificationTypes: ["voice", "visit"],
    },
  ]

  // Category filters
  const categories = [
    { id: "all", name: "All", type: "all" as const },
    { id: "food", name: "Food & Drink", type: "food" as const },
    { id: "travel", name: "Travel", type: "travel" as const },
  ]

  // Add loading state
  const [isLoading, setIsLoading] = useState(true)
  const [voiceOnly, setVoiceOnly] = useState(false)
  const [activeTab, setActiveTab] = useState("for-you")

  // Add useEffect to simulate loading
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter recommendations based on voice-only toggle
  const filteredRecommendations = voiceOnly
    ? recommendations.filter((rec) => rec.verificationTypes?.includes("voice"))
    : recommendations

  return (
    <div className="pb-16">
      <Header />
      <main className="container px-4 py-6">
        <Tabs defaultValue="for-you" onValueChange={setActiveTab} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="verified">Voice Verified</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Switch id="voice-only" checked={voiceOnly} onCheckedChange={setVoiceOnly} />
              <Label htmlFor="voice-only" className="flex items-center">
                <Mic className="h-4 w-4 mr-1 text-primary" />
                Voice Only
              </Label>
            </div>
          </div>

          <TabsContent value="for-you">
            <section aria-labelledby="for-you-heading">
              <div className="mb-6 flex items-center justify-between">
                <h2 id="for-you-heading" className="text-2xl font-bold">
                  Recommended For You
                </h2>

                {/* Categories */}
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2" role="tablist">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="h-auto flex-col py-4 px-6 bg-white min-w-[100px]"
                      role="tab"
                      aria-selected={category.id === "all"}
                      tabIndex={category.id === "all" ? 0 : -1}
                    >
                      {category.id === "all" ? (
                        <span className="text-base mb-1">All</span>
                      ) : (
                        <>
                          <CategoryIcon type={category.type} size={24} className="mb-1" />
                          <span className="text-xs">{category.name}</span>
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {isLoading ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RecommendationSkeleton />
                    <RecommendationSkeleton />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <RecommendationSkeleton />
                    <RecommendationSkeleton />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRecommendations.slice(0, 2).map((recommendation) => (
                      <article key={recommendation.id}>
                        <RecommendationCard recommendation={recommendation} />
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRecommendations.slice(2).map((recommendation) => (
                      <article key={recommendation.id}>
                        <RecommendationCard recommendation={recommendation} />
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          </TabsContent>

          <TabsContent value="trending">
            <div className="h-40 flex items-center justify-center text-muted-foreground">
              Trending content would appear here
            </div>
          </TabsContent>

          <TabsContent value="verified">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Voice Verified Recommendations</h2>
              <p className="text-muted-foreground">Authentic recommendations verified by voice analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations
                .filter((rec) => rec.verificationTypes?.includes("voice"))
                .map((recommendation) => (
                  <article key={recommendation.id}>
                    <RecommendationCard recommendation={recommendation} />
                  </article>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <CreateMurmurButton />
    </div>
  )
}
