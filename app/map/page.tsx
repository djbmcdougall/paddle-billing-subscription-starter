"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Loader2 } from "lucide-react"
import Header from "@/components/header"
import RecommendationCard from "@/components/recommendation-card"
import CreateMurmurButton from "@/components/create-murmur-button"
import { useToast } from "@/components/ui/use-toast"

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMurmur, setSelectedMurmur] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const mapRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mock data for geotagged murmurs
  const murmurs = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      },
      text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly.",
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
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40&text=MC",
      },
      text: "The new hiking trail at Evergreen Park is absolutely stunning! Great views and well-maintained paths.",
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
    {
      id: "3",
      user: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40&text=DK",
      },
      text: "The service at Tech Gadgets was disappointing. Waited for 30 minutes and the staff wasn't knowledgeable.",
      location: "Tech Gadgets Store",
      coordinates: {
        latitude: 37.7831,
        longitude: -122.4039,
      },
      category: "Shopping",
      sentiment: "Negative",
      image: "/placeholder.svg?height=300&width=400&text=Electronics+Store",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsDown: 8,
        thumbsUp: 2,
      },
      verified: true,
    },
  ]

  useEffect(() => {
    // Simulate loading the map
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Show a toast when map is ready
      toast({
        title: "Map loaded",
        description: "Showing nearby murmurs in your area",
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [toast])

  // In a real implementation, this would initialize a map library like Google Maps or Mapbox
  useEffect(() => {
    if (!isLoading && mapRef.current) {
      // This is where you would initialize the map with the murmur locations
      console.log("Map would be initialized here with murmurs:", murmurs)
    }
  }, [isLoading, murmurs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Searching...",
      description: `Finding murmurs near "${searchQuery}"`,
    })
  }

  return (
    <div className="pb-16">
      <Header showSearch={false} />

      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Murmur Map</h1>
          <p className="text-muted-foreground mb-4">Discover voice recommendations near you</p>

          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for places or addresses..."
              className="pl-10 py-6 text-lg rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-2 top-2">
              Search
            </Button>
          </form>

          {/* Map Container */}
          <div className="relative w-full h-[50vh] mb-6 rounded-lg overflow-hidden border">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p>Loading map...</p>
                </div>
              </div>
            ) : (
              <div
                ref={mapRef}
                className="w-full h-full bg-muted"
                style={{
                  backgroundImage: `url(/placeholder.svg?height=600&width=800&text=Map+View)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Map pins would be rendered here */}
                {murmurs.map((murmur) => (
                  <div
                    key={murmur.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                    }}
                    onClick={() => setSelectedMurmur(murmur)}
                  >
                    <div
                      className={`p-1 rounded-full ${murmur.sentiment === "Positive" ? "bg-success" : "bg-destructive"}`}
                    >
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Murmur */}
          {selectedMurmur && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Selected Murmur</h2>
              <RecommendationCard recommendation={selectedMurmur} />
            </div>
          )}

          {/* Nearby Murmurs */}
          <div>
            <h2 className="text-xl font-bold mb-4">Nearby Murmurs</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {murmurs.map((murmur) => (
                <Card
                  key={murmur.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMurmur(murmur)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">{murmur.location}</span>
                    </div>
                    <p className="text-sm line-clamp-2">{murmur.text}</p>
                    <div className="flex items-center mt-2">
                      <div className="h-6 w-6 rounded-full bg-muted overflow-hidden relative mr-2">
                        <img
                          src={murmur.user.avatar || "/placeholder.svg"}
                          alt={murmur.user.name}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{murmur.user.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreateMurmurButton />
    </div>
  )
}
