"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Quicksand } from "next/font/google"

const quicksand = Quicksand({ subsets: ["latin"] })

// Country codes with flags and languages
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", language: "English" },
  { code: "+44", country: "GB", flag: "🇬🇧", language: "English" },
  { code: "+33", country: "FR", flag: "🇫🇷", language: "French" },
  { code: "+49", country: "DE", flag: "🇩🇪", language: "German" },
  { code: "+34", country: "ES", flag: "🇪🇸", language: "Spanish" },
  { code: "+39", country: "IT", flag: "🇮🇹", language: "Italian" },
  { code: "+81", country: "JP", flag: "🇯🇵", language: "Japanese" },
  { code: "+86", country: "CN", flag: "🇨🇳", language: "Chinese" },
  { code: "+91", country: "IN", flag: "🇮🇳", language: "Hindi" },
  { code: "+55", country: "BR", flag: "🇧🇷", language: "Portuguese" },
  { code: "+7", country: "RU", flag: "🇷🇺", language: "Russian" },
  { code: "+61", country: "AU", flag: "🇦🇺", language: "English" },
  { code: "+52", country: "MX", flag: "🇲🇽", language: "Spanish" },
  { code: "+82", country: "KR", flag: "🇰🇷", language: "Korean" },
  { code: "+31", country: "NL", flag: "🇳🇱", language: "Dutch" },
  { code: "+46", country: "SE", flag: "🇸🇪", language: "Swedish" },
  { code: "+47", country: "NO", flag: "🇳🇴", language: "Norwegian" },
  { code: "+45", country: "DK", flag: "🇩🇰", language: "Danish" },
  { code: "+358", country: "FI", flag: "🇫🇮", language: "Finnish" },
  { code: "+48", country: "PL", flag: "🇵🇱", language: "Polish" },
]

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  // Get country info based on selected code
  const selectedCountry = countryCodes.find((c) => c.code === countryCode)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Format full phone number with country code
    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`

    try {
      // Pass country info to signup
      await signup(name, email, password, {
        phoneNumber: fullPhoneNumber,
        countryCode,
        countryFlag: selectedCountry?.flag || "🏳️",
        language: selectedCountry?.language || "English",
      })
      router.push("/")
    } catch (err) {
      setError("Error creating account. Please try again.")
    }
  }

  // Format phone number as user types
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    let value = e.target.value.replace(/\D/g, "")

    // Format based on US phone number (can be expanded for international formats)
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value
      } else if (value.length <= 6) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`
      } else {
        value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`
      }
    }

    setPhoneNumber(value)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-primary/20">
      <div className="mb-8 flex items-center">
        <Image
          src="/images/murmur-logo.png"
          alt="Murmur Logo"
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
        <span className={`${quicksand.className} ml-1 text-2xl font-bold text-black`}>murmur</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to create a new Murmur account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex space-x-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123-456-7890"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                />
              </div>
              {selectedCountry && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCountry.flag} {selectedCountry.country} ({selectedCountry.language})
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
