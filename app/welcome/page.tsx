"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Quicksand } from "next/font/google"

const quicksand = Quicksand({ subsets: ["latin"] })

export default function WelcomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Function to bypass login for testing
  const handleBypassAuth = () => {
    // Set authentication cookie
    document.cookie = "murmur_user=authenticated; path=/; max-age=86400"

    // Create a default user in localStorage
    const defaultUser = {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      avatar: "/placeholder.svg?height=120&width=120&text=DU",
      following: [],
      followers: [],
    }
    localStorage.setItem("murmur_user", JSON.stringify(defaultUser))

    // Redirect to home
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-primary/20">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6 flex justify-center items-center">
            <Image
              src="/images/murmur-logo.png"
              alt="Murmur Logo"
              width={80}
              height={80}
              className="h-20 w-20 object-contain mr-2"
            />
            <h1 className={`${quicksand.className} text-4xl font-bold text-black`}>murmur</h1>
          </div>

          <p className="text-xl mb-8">Discover authentic voice recommendations from people you trust</p>

          <div className="space-y-4">
            <Button asChild className="w-full py-6 text-lg">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full py-6 text-lg bg-white">
              <Link href="/signup">Sign Up</Link>
            </Button>

            {/* Emergency bypass button for testing */}
            <Button variant="secondary" className="w-full py-6 text-lg" onClick={handleBypassAuth}>
              Enter App (Bypass Login)
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 px-4 bg-card">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Murmur?</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Voice-First Experience</h3>
                <p className="text-muted-foreground">Share authentic recommendations with your voice, not just text</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M17 6.1H3"></path>
                  <path d="M21 12.1H3"></path>
                  <path d="M15.1 18H3"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Curated Feeds</h3>
                <p className="text-muted-foreground">Discover recommendations from people you trust and follow</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Location-Based</h3>
                <p className="text-muted-foreground">Find recommendations near you from locals who know best</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-4 bg-muted text-center">
        <p className="text-sm text-muted-foreground">© 2023 Murmur. All rights reserved.</p>
      </div>
    </div>
  )
}
