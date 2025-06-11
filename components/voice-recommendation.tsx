"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import AudioWaveform from "./audio-waveform"

interface VoiceRecommendationProps {
  audioUrl: string
  transcript: string
  duration: number
  metadata: {
    title: string
    category: string
  }
  onPreview?: () => void
  className?: string
}

export default function VoiceRecommendation({
  audioUrl,
  transcript,
  duration,
  metadata,
  onPreview,
  className,
}: VoiceRecommendationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [playbackPosition, setPlaybackPosition] = useState(0)

  const formatDuration = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleFullPlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const playPreview = () => {
    // Auto-preview functionality for desktop hover
    if (onPreview) {
      onPreview()
    }
  }

  const handleTimeUpdate = (currentTime: number) => {
    setPlaybackPosition(currentTime)
  }

  const handlePlaybackComplete = () => {
    setIsPlaying(false)
    setPlaybackPosition(0)
  }

  return (
    <Card className={`group hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardContent className="p-4">
        {/* Quick Preview - Hover to hear snippet */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onMouseEnter={playPreview} // Auto-preview on hover (desktop)
          onClick={toggleFullPlayback}
        >
          <Button size="sm" variant="ghost" className="rounded-full w-10 h-10 group-hover:bg-blue-50">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{metadata.title}</span>
              <span className="text-xs text-gray-500">{formatDuration(duration)}</span>
            </div>

            {/* Waveform visualization */}
            <div className="mt-2">
              <AudioWaveform
                audioUrl={audioUrl}
                isPlaying={isPlaying}
                height={30}
                barWidth={2}
                barGap={1}
                onTimeUpdate={handleTimeUpdate}
                onPlaybackComplete={handlePlaybackComplete}
                useGradient={true}
              />
            </div>
          </div>
        </div>

        {/* Progressive Disclosure - Show more details */}
        <Collapsible open={showTranscript} onOpenChange={setShowTranscript}>
          <CollapsibleTrigger className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition-colors">
            {showTranscript ? "Hide" : "Show"} transcript
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 p-3 bg-gray-50 rounded text-sm leading-relaxed">
            {transcript}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
