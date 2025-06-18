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

  // Mock data for geotagged murmurs with real images
  const murmurs = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "/users/sarah-johnson.jpg",
        trustScore: 87,
      },
      text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. The barista recommended their signature blend and it was incredible.",
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
      verificationTypes: ["voice", "visit"],
      actionButton: {
        type: "reservation",
        label: "Reservation",
        url: "https://example.com/reserve",
      },
    },
    {
      id: "2",
      user: {
        name: "Mike Chen",
        avatar: "/users/mike-chen.jpg",
        trustScore: 73,
      },
      text: "The new hiking trail at Evergreen Park is absolutely stunning! Great views and well-maintained paths. Perfect for a morning workout or peaceful evening walk.",
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
    {
      id: "3",
      user: {
        name: "David Kim",
        avatar: "/users/david-kim.jpg",
        trustScore: 45,
      },
      text: "The service at Tech Gadgets was disappointing. Waited for 30 minutes and the staff wasn't knowledgeable about their products. Would not recommend.",
      location: "Tech Gadgets Store",
      coordinates: {
        latitude: 37.7831,
        longitude: -122.4039,
      },
      category: "Shopping",
      sentiment: "Negative",
      image: "/recommendations/tech-gadgets-store.jpg",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsDown: 8,
        thumbsUp: 2,
      },
      verified: true,
      verificationTypes: ["voice", "purchase"],
      actionButton: {
        type: "directions",
        label: "Directions",
        coordinates: {
          latitude: 37.7831,
          longitude: -122.4039,
        },
      },
    },
    {
      id: "4",
      user: {
        name: "Emily Rodriguez",
        avatar: "/users/emily-rodriguez.jpg",
        trustScore: 92,
      },
      text: "Amazing bookstore with a great selection of local authors! The staff gave excellent recommendations and they have a cozy reading corner with great coffee.",
      location: "Pages & Prose Bookstore",
      coordinates: {
        latitude: 37.7849,
        longitude: -122.4094,
      },
      category: "Shopping",
      sentiment: "Positive",
      image: "/recommendations/bookstore.jpg",
      audio: "/placeholder.mp3",
      reactions: {
        thumbsUp: 31,
        heart: 15,
      },
      verified: true,
      verificationTypes: ["voice", "purchase", "visit"],
      actionButton: {
        type: "directions",
        label: "Directions",
        coordinates: {
          latitude: 37.7849,
          longitude: -122.4094,
        },
      },
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
                className="w-full h-full bg-muted relative"
                style={{
                  backgroundImage: `url(/maps/san-francisco-3d-map.webp)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Map controls (Google Maps style) */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <div className="bg-white rounded shadow-md p-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="text-lg font-bold">+</span>
                    </Button>
                  </div>
                  <div className="bg-white rounded shadow-md p-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="text-lg font-bold">−</span>
                    </Button>
                  </div>
                </div>

                {/* Custom Murmur pins overlaid on the existing map pins */}
                {murmurs.map((murmur, index) => (
                  <div
                    key={murmur.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${30 + index * 15}%`,
                      top: `${40 + index * 10}%`,
                    }}
                    onClick={() => setSelectedMurmur(murmur)}
                  >
                    <div
                      className={`p-2 rounded-full shadow-lg border-2 border-white ${
                        murmur.sentiment === "Positive" ? "bg-green-500" : "bg-red-500"
                      } hover:scale-110 transition-transform`}
                    >
                      <MapPin className="h-4 w-4 text-white" />
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
                    <p className="text-sm line-clamp-2 mb-2">{murmur.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-muted overflow-hidden relative mr-2">
                          <img
                            src={murmur.user.avatar || "/placeholder.svg"}
                            alt={murmur.user.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">{murmur.user.name}</span>
                          {murmur.user.trustScore && (
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                murmur.user.trustScore >= 80
                                  ? "bg-green-500"
                                  : murmur.user.trustScore >= 60
                                    ? "bg-blue-500"
                                    : murmur.user.trustScore >= 40
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                            >
                              {murmur.user.trustScore}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Play audio functionality would go here
                          toast({
                            title: "Playing audio",
                            description: `Playing ${murmur.user.name}'s recommendation`,
                          })
                        }}
                      >
                        Play
                      </Button>
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
