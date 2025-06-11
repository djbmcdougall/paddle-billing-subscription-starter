"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceRecordingButtonProps {
  onRecordingStart?: () => void
  onRecordingStop?: (audioBlob: Blob) => void
  onRecordingError?: (error: string) => void
  className?: string
  maxDuration?: number // in seconds
  disabled?: boolean
}

type RecordingState = "idle" | "recording" | "processing" | "error"

export default function VoiceRecordingButton({
  onRecordingStart,
  onRecordingStop,
  onRecordingError,
  className,
  maxDuration = 30,
  disabled = false,
}: VoiceRecordingButtonProps) {
  const [state, setState] = useState<RecordingState>("idle")
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number>(0)
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Cleanup function
  const cleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current)
    }
  }

  // Audio level monitoring
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    setAudioLevel(average / 255) // Normalize to 0-1

    if (state === "recording") {
      animationRef.current = requestAnimationFrame(monitorAudioLevel)
    }
  }

  const startRecording = async () => {
    try {
      setState("recording")
      setDuration(0)
      chunksRef.current = []

      // Haptic feedback on mobile
      if ("vibrate" in navigator) {
        navigator.vibrate(50)
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      // Set up audio context for level monitoring
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Start monitoring audio levels
      monitorAudioLevel()

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        setState("processing")
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })

        // Small delay to show processing state
        setTimeout(() => {
          setState("idle")
          onRecordingStop?.(audioBlob)
        }, 500)
      }

      mediaRecorder.start()

      // Start duration timer
      durationTimerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1
          if (newDuration >= maxDuration) {
            stopRecording()
          }
          return newDuration
        })
      }, 1000)

      onRecordingStart?.()
    } catch (error) {
      setState("error")
      const errorMessage = error instanceof Error ? error.message : "Failed to access microphone"
      onRecordingError?.(errorMessage)

      setTimeout(() => setState("idle"), 2000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    cleanup()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (state === "idle" && !disabled) {
      startRecording()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (state === "recording") {
      stopRecording()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (state === "idle" && !disabled) {
      startRecording()
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    if (state === "recording") {
      stopRecording()
    }
  }

  const getRecordingAriaLabel = () => {
    switch (state) {
      case "recording":
        return `Recording... ${duration} seconds`
      case "processing":
        return "Processing recording..."
      case "error":
        return "Recording failed"
      default:
        return "Hold to record voice message"
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [])

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300 ease-out rounded-full w-16 h-16 flex items-center justify-center",
          {
            "bg-red-500 scale-110 shadow-lg shadow-red-500/25": state === "recording",
            "bg-yellow-500 animate-pulse": state === "processing",
            "bg-red-600": state === "error",
            "bg-primary": state === "idle",
          },
        )}
        aria-label={getRecordingAriaLabel()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={disabled || state === "processing"}
      >
        {state === "recording" && <div className="absolute inset-0 bg-red-400 animate-ping rounded-full opacity-30" />}

        {state === "processing" ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : state === "error" ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic
            className={cn("w-6 h-6 text-white", {
              "animate-bounce": state === "recording",
            })}
          />
        )}
      </Button>

      {/* Duration indicator */}
      {state === "recording" && (
        <div className="mt-2 text-sm font-mono text-red-600">
          {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
          <span className="text-xs text-gray-500 ml-1">/ {maxDuration}s</span>
        </div>
      )}

      {/* Audio level visualization */}
      {state === "recording" && (
        <div className="flex items-center space-x-1 h-8 mt-2">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-500 rounded-full transition-all duration-100 animate-pulse"
              style={{
                height: `${Math.max(4, audioLevel * 100 * (0.5 + Math.random() * 0.5))}%`,
                minHeight: "4px",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
