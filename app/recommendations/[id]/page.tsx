import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VerifiedBadge } from "@/components/verified-badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faHeart, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { PlayAudio } from "@/components/play-audio"

export default async function RecommendationPage({ params }: { params: { id: string } }) {
  const recommendation = {
    id: params.id,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      trustScore: 87,
    },
    text: "I absolutely loved the coffee at Brew & Bean! The atmosphere was cozy and the staff was super friendly. Definitely recommend their caramel latte! The pastries were also fresh and delicious. I spent a few hours working there and the WiFi was fast and reliable. The prices are reasonable for the quality you get. I'll definitely be coming back regularly. The outdoor seating area is perfect for sunny days, and they have a great selection of books to read while you enjoy your coffee.",
    location: "Brew & Bean Coffee Shop",
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    category: "Food & Drink",
    sentiment: "Positive",
    image: "/placeholder.svg?height=400&width=600&text=Coffee+Shop+Interior",
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
  }

  return (
    <Card className="w-[80%] mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={recommendation.user.avatar || "/placeholder.svg"} />
            <AvatarFallback>{recommendation.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="flex items-center">
              {recommendation.user.name}
              {recommendation.user.trustScore > 75 && <VerifiedBadge />}
            </CardTitle>
            <CardDescription>Trust Score: {recommendation.user.trustScore}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <img src={recommendation.image || "/placeholder.svg"} alt="Recommendation" className="w-full rounded-md mb-4" />
        <p className="text-md mb-4">{recommendation.text}</p>
        <div className="flex items-center space-x-2 mb-4">
          <FontAwesomeIcon icon={faLocationDot} />
          <span>{recommendation.location}</span>
        </div>
        <PlayAudio src={recommendation.audio} />
        <div className="flex items-center space-x-4">
          <Badge>{recommendation.category}</Badge>
          {recommendation.verified && (
            <Badge variant="secondary">Verified: {recommendation.verificationTypes.join(", ")}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            {recommendation.reactions.thumbsUp}
          </Button>
          <Button variant="ghost">
            <FontAwesomeIcon icon={faHeart} className="mr-2" />
            {recommendation.reactions.heart}
          </Button>
        </div>
        {recommendation.actionButton && (
          <Button asChild>
            <a href={recommendation.actionButton.url}>{recommendation.actionButton.label}</a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
