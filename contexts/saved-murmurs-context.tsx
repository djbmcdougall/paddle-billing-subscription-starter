"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface SavedMurmursContextType {
  savedMurmurs: string[]
  saveMurmur: (murmurId: string) => void
  unsaveMurmur: (murmurId: string) => void
  isSaved: (murmurId: string) => boolean
}

const SavedMurmursContext = createContext<SavedMurmursContextType | undefined>(undefined)

export function SavedMurmursProvider({ children }: { children: React.ReactNode }) {
  const [savedMurmurs, setSavedMurmurs] = useState<string[]>([])
  const { toast } = useToast()

  // Load saved murmurs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedMurmurs")
    if (saved) {
      setSavedMurmurs(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever savedMurmurs changes
  useEffect(() => {
    localStorage.setItem("savedMurmurs", JSON.stringify(savedMurmurs))
  }, [savedMurmurs])

  const saveMurmur = (murmurId: string) => {
    setSavedMurmurs((prev) => {
      if (!prev.includes(murmurId)) {
        toast({
          title: "Murmur saved!",
          description: "Added to your saved murmurs.",
        })
        return [...prev, murmurId]
      }
      return prev
    })
  }

  const unsaveMurmur = (murmurId: string) => {
    setSavedMurmurs((prev) => {
      const filtered = prev.filter((id) => id !== murmurId)
      if (filtered.length !== prev.length) {
        toast({
          title: "Murmur removed",
          description: "Removed from your saved murmurs.",
        })
      }
      return filtered
    })
  }

  const isSaved = (murmurId: string) => {
    return savedMurmurs.includes(murmurId)
  }

  return (
    <SavedMurmursContext.Provider value={{ savedMurmurs, saveMurmur, unsaveMurmur, isSaved }}>
      {children}
    </SavedMurmursContext.Provider>
  )
}

export function useSavedMurmurs() {
  const context = useContext(SavedMurmursContext)
  if (context === undefined) {
    throw new Error("useSavedMurmurs must be used within a SavedMurmursProvider")
  }
  return context
}
