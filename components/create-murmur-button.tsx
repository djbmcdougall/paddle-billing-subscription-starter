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
      className="fixed bottom-20 right-4 md:right-8 rounded-full shadow-lg h-16 w-16 md:h-18 md:w-18 p-0 bg-primary hover:bg-primary/90 z-40 animate-pulse"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Mic className="h-8 w-8" />}
      <span className="sr-only">Record voice review</span>
    </Button>
  )
}
