"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, MapPin } from "lucide-react"
import Image from "next/image"
import RecommendationCard from "@/components/recommendation-card"
import CategoryIcon from "@/components/category-icon"
import AddCategoryDialog from "@/components/add-category-dialog"

export default function DiscoverPage() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Food & Drink", type: "food" as const },
    { id: "2", name: "Travel", type: "travel" as const },
    { id: "3", name: "Shopping", type: "shopping" as const },
    { id: "4", name: "Entertainment", type: "entertainment" as const },
  ])

  // Mock data for trending recommendations with real images
  const trendingRecommendations = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/users/sarah-johnson.jpg",
        trustScore: 87,
      },
      text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. Definitely recommend their caramel latte! The pastries were also fresh and delicious. I spent a few hours working there and the WiFi was fast and reliable. The prices are reasonable for the quality you get. I'll definitely be coming back regularly.",
      location: "Brew & Bean Coffee Shop",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      category: "Food & Drink",
      sentiment: "Positive",
      images: ["/recommendations/sarah-coffee-1.jpg", "/recommendations/sarah-coffee-2.jpg"],
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 24,
        heart: 12,
      },
      verified: true,
      verificationTypes: ["voice", "purchase", "visit"],
      actionButton: {
        type: "reservation",
        label: "Reservation",
        url: "https://example.com/reservation",
      },
    },
    {
      id: "2",
      user: {
        name: "Mike Chen",
        avatar: "/users/mike-chen.jpg",
        trustScore: 73,
      },
      text: "The new hiking trail at Evergreen Park is absolutely stunning! Great views and well-maintained paths. Perfect for a weekend adventure. I went there last Saturday and was amazed by the natural beauty. The trail is about 5 miles long with moderate difficulty, so it's suitable for most hikers. There are several lookout points along the way with breathtaking views of the valley and mountains beyond.",
      location: "Evergreen Park",
      coordinates: {
        latitude: 37.7694,
        longitude: -122.4862,
      },
      category: "Outdoors",
      sentiment: "Positive",
      image: "/recommendations/hiking-trail.jpg",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 18,
        heart: 9,
      },
      verified: true,
      verificationTypes: ["voice", "visit"],
      actionButton: {
        type: "directions",
        label: "Directions",
        coordinates: {
          latitude: 37.7694,
          longitude: -122.4862,
        },
      },
    },
  ]

  // Mock data for suggested users with real profile pictures
  const suggestedUsers = [
    {
      id: "1",
      name: "Jamie Oliver",
      avatar: "/users/jamie-oliver.jpg",
      bio: "Food critic & restaurant reviewer",
      murmurs: 87,
    },
    {
      id: "2",
      name: "Lisa Travel",
      avatar: "/users/lisa-travel.jpg",
      bio: "Travel blogger & adventure seeker",
      murmurs: 124,
    },
    {
      id: "3",
      name: "Tech Review Guy",
      avatar: "/users/tech-review-guy.jpg",
      bio: "Honest tech product reviews",
      murmurs: 56,
    },
  ]

  const handleAddCategory = (newCategory: { name: string; icon: string }) => {
    setCategories((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newCategory.name,
        type: "custom" as const,
      },
    ])
  }

  return (
    <div className="pb-16">
      <Header showSearch={false} />

      <div className="container px-4 py-6">
        <div className="mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search recommendations, places, or people..."
              className="pl-10 py-6 text-lg rounded-xl"
            />
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-xl font-bold">Explore Categories</h2>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {categories.map((category) => (
                <Button key={category.id} variant="outline" className="h-auto flex-col py-4">
                  <CategoryIcon type={category.type} className="mb-1" size={24} />
                  <span className="text-xs">{category.name}</span>
                </Button>
              ))}
              <AddCategoryDialog onAdd={handleAddCategory} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="trending" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Discover</h2>
            <TabsList>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="trending">
            <div className="mb-4 flex items-center text-sm text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>Popular recommendations right now</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {trendingRecommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nearby">
            <div className="mb-4 flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>Recommendations near you</span>
            </div>

            <Card className="flex h-60 items-center justify-center">
              <CardContent className="text-center">
                <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Enable location</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Allow Murmur to access your location to see nearby recommendations
                </p>
                <Button className="mt-4">Enable Location</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="people">
            <div className="mb-4 flex items-center text-sm text-muted-foreground">
              <span>People you might want to listen to</span>
            </div>

            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-14 w-14 rounded-full bg-muted overflow-hidden relative">
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            width={60}
                            height={60}
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `/placeholder.svg?height=60&width=60&text=${user.name.charAt(0)}`
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.bio}</p>
                          <p className="text-xs text-muted-foreground">{user.murmurs} Murmurs</p>
                        </div>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">Listen</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
