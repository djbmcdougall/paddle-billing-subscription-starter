"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecommendationCard from "@/components/recommendation-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MapPin, Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState({
    recommendations: [],
    places: [],
    people: [],
  })

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)

      // In a real app, this would be an API call to search
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockRecommendations = [
          {
            id: "1",
            user: {
              name: "Sarah Johnson",
              avatar: "/placeholder.svg?height=40&width=40&text=SJ",
            },
            text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. Definitely recommend their caramel latte!",
            location: "Brew & Bean Coffee Shop",
            category: "Food & Drink",
            sentiment: "Positive",
            image: "/placeholder.svg?height=300&width=400&text=Coffee+Shop",
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
            text: "The new hiking trail at Evergreen Park is absolutely stunning! Great views and well-maintained paths. Perfect for a weekend adventure.",
            location: "Evergreen Park",
            category: "Outdoors",
            sentiment: "Positive",
            image: "/placeholder.svg?height=300&width=400&text=Hiking+Trail",
            reactions: {
              thumbsUp: 18,
              heart: 9,
            },
            verified: true,
          },
        ]

        const mockPlaces = [
          {
            id: "1",
            name: "Brew & Bean Coffee Shop",
            address: "123 Main St, San Francisco, CA",
            category: "Coffee Shop",
            rating: 4.8,
            reviewCount: 156,
            image: "/placeholder.svg?height=200&width=300&text=Coffee+Shop",
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
          },
          {
            id: "2",
            name: "Evergreen Park",
            address: "456 Park Ave, San Francisco, CA",
            category: "Park",
            rating: 4.6,
            reviewCount: 89,
            image: "/placeholder.svg?height=200&width=300&text=Park",
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
          },
        ]

        const mockPeople = [
          {
            id: "1",
            name: "Jamie Oliver",
            avatar: "/placeholder.svg?height=60&width=60&text=JO",
            bio: "Food critic & restaurant reviewer",
            murmurs: 87,
            following: false,
          },
          {
            id: "2",
            name: "Lisa Travel",
            avatar: "/placeholder.svg?height=60&width=60&text=LT",
            bio: "Travel blogger & adventure seeker",
            murmurs: 124,
            following: true,
          },
        ]

        setResults({
          recommendations: mockRecommendations,
          places: mockPlaces,
          people: mockPeople,
        })
        setIsLoading(false)
      }, 1000)
    }

    if (query) {
      fetchResults()
    } else {
      setIsLoading(false)
    }
  }, [query])

  return (
    <div className="pb-16">
      <Header />

      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{query ? `Search results for "${query}"` : "Search"}</h1>
        </div>

        {!query ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-medium">Search for recommendations</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Enter a search term to find recommendations, places, or people
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-8">
                {results.recommendations.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-medium">Recommendations</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.recommendations.slice(0, 3).map((recommendation) => (
                        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                      ))}
                    </div>
                  </div>
                )}

                {results.places.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-medium">Places</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {results.places.slice(0, 2).map((place) => (
                        <Card key={place.id} className="overflow-hidden">
                          <div className="relative h-40 w-full">
                            <Image
                              src={place.image || "/placeholder.svg"}
                              alt={place.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{place.name}</h3>
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span>{place.address}</span>
                            </div>
                            <div className="mt-2 flex items-center">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-sm ${i < Math.floor(place.rating) ? "text-yellow-500" : "text-muted-foreground"}`}
                                  >
                                    ★
                                  </span>
                                ))}
                                <span className="ml-1 text-sm">{place.rating}</span>
                              </div>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{place.reviewCount} reviews</span>
                            </div>
                            <Button className="mt-3 w-full">View Details</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {results.people.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-medium">People</h2>
                    <div className="space-y-4">
                      {results.people.map((person) => (
                        <Card key={person.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={person.avatar || "/placeholder.svg"}
                                  alt={person.name}
                                  width={60}
                                  height={60}
                                  className="h-14 w-14 rounded-full object-cover"
                                />
                                <div>
                                  <h3 className="font-medium">{person.name}</h3>
                                  <p className="text-sm text-muted-foreground">{person.bio}</p>
                                  <p className="text-xs text-muted-foreground">{person.murmurs} Murmurs</p>
                                </div>
                              </div>
                              <Button
                                variant={person.following ? "outline" : "default"}
                                className={person.following ? "" : "bg-purple-600 hover:bg-purple-700 text-white"}
                              >
                                {person.following ? "Following" : "Follow"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              {results.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.recommendations.map((recommendation) => (
                    <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="mb-4 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No recommendations found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="places">
              {results.places.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.places.map((place) => (
                    <Card key={place.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{place.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span>{place.address}</span>
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < Math.floor(place.rating) ? "text-yellow-500" : "text-muted-foreground"}`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1 text-sm">{place.rating}</span>
                          </div>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{place.reviewCount} reviews</span>
                        </div>
                        <Button className="mt-3 w-full">View Details</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="mb-4 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No places found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="people">
              {results.people.length > 0 ? (
                <div className="space-y-4">
                  {results.people.map((person) => (
                    <Card key={person.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={person.avatar || "/placeholder.svg"}
                              alt={person.name}
                              width={60}
                              height={60}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-medium">{person.name}</h3>
                              <p className="text-sm text-muted-foreground">{person.bio}</p>
                              <p className="text-xs text-muted-foreground">{person.murmurs} Murmurs</p>
                            </div>
                          </div>
                          <Button
                            variant={person.following ? "outline" : "default"}
                            className={person.following ? "" : "bg-purple-600 hover:bg-purple-700 text-white"}
                          >
                            {person.following ? "Following" : "Follow"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="mb-4 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No people found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
