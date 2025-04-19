"use client"

import { useState } from "react"

export const useCopyProfileLink = () => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async (userId: string) => {
    const profileLink = `https://murmur.app/profile/${userId}`
    try {
      await navigator.clipboard.writeText(profileLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      console.error("Failed to copy profile link: ", err)
    }
  }

  return { isCopied, handleCopy }
}
