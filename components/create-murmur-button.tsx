"use client"

import { useState } from "react"
import { Mic, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function CreateMurmurButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleClick = () => {
    setIsLoading(true)

    // Show a loading toast
    toast({
      title: "Opening recorder...",
      description: "Preparing to capture your voice recommendation",
    })

    // Navigate to the record page
    setTimeout(() => {
      router.push("/record")
      setIsLoading(false)
    }, 500)
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="fixed bottom-20 right-4 md:right-8 rounded-full shadow-lg h-14 w-14 md:h-16 md:w-16 p-0 bg-accent hover:bg-accent/90 z-40"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Mic className="h-6 w-6" />}
      <span className="sr-only">Create new murmur</span>
    </Button>
  )
}
