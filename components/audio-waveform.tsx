"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AudioWaveformProps {
  audioUrl: string
  isPlaying: boolean
  className?: string
  barWidth?: number
  barGap?: number
  barColor?: string
  progressColor?: string
  height?: number
  useGradient?: boolean
  gradientColors?: [string, string]
  onPlaybackComplete?: () => void
  onTimeUpdate?: (currentTime: number) => void
  audioLevel?: number
  showRealTimeVisualization?: boolean
}

export default function AudioWaveform({
  audioUrl,
  isPlaying,
  className,
  barWidth = 3,
  barGap = 2,
  barColor = "#DADBE9", // Mist
  progressColor = "#7B91C9", // Accent Blue
  height = 40,
  useGradient = false,
  gradientColors = ["#7B91C9", "#9F9BC8"], // Accent Blue to Accent Lavender
  onPlaybackComplete,
  onTimeUpdate,
  audioLevel = 0,
  showRealTimeVisualization = false,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioData, setAudioData] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [realTimeData, setRealTimeData] = useState<number[]>([])

  // Initialize audio element and load audio data
  useEffect(() => {
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    audio.crossOrigin = "anonymous"
    audioRef.current = audio

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
      setIsLoaded(true)
    })

    audio.addEventListener("ended", () => {
      if (onPlaybackComplete) {
        onPlaybackComplete()
      }
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime)
      }
    })

    // Generate more realistic waveform data
    const generateWaveformData = () => {
      const dataPoints = 50
      const data = Array(dataPoints)
        .fill(0)
        .map((_, i) => {
          // Create a more natural looking waveform with variations
          const position = i / dataPoints
          const centerDistance = Math.abs(position - 0.5)
          const baseAmplitude = 0.3 + Math.sin(position * Math.PI * 4) * 0.2
          const randomVariation = Math.random() * 0.3
          const amplitude = Math.max(0.1, baseAmplitude + randomVariation - centerDistance * 0.4)
          return amplitude
        })
      setAudioData(data)
    }

    generateWaveformData()

    return () => {
      audio.pause()
      audio.src = ""
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("ended", () => {})
      audio.removeEventListener("timeupdate", () => {})
    }
  }, [audioUrl, onPlaybackComplete, onTimeUpdate])

  // Initialize Web Audio API for real-time visualization
  useEffect(() => {
    if (!audioRef.current || !isLoaded || !showRealTimeVisualization) return

    const initializeAudio = async () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const audioContext = new AudioContext()
        audioContextRef.current = audioContext

        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8
        analyserRef.current = analyser

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        dataArrayRef.current = dataArray

        const source = audioContext.createMediaElementSource(audioRef.current!)
        source.connect(analyser)
        analyser.connect(audioContext.destination)
        sourceRef.current = source

        // Start real-time analysis
        const updateRealTimeData = () => {
          if (analyserRef.current && dataArrayRef.current && isPlaying) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current)

            // Convert frequency data to waveform visualization
            const bars = 20
            const step = Math.floor(dataArrayRef.current.length / bars)
            const newData = Array(bars)
              .fill(0)
              .map((_, i) => {
                const start = i * step
                const end = start + step
                const slice = dataArrayRef.current!.slice(start, end)
                const average = slice.reduce((sum, value) => sum + value, 0) / slice.length
                return average / 255 // Normalize to 0-1
              })

            setRealTimeData(newData)
          }

          if (isPlaying) {
            animationRef.current = requestAnimationFrame(updateRealTimeData)
          }
        }

        if (isPlaying) {
          updateRealTimeData()
        }
      } catch (error) {
        console.error("Error initializing audio context:", error)
      }
    }

    initializeAudio()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        if (sourceRef.current) {
          sourceRef.current.disconnect()
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect()
        }
      }
    }
  }, [isLoaded, isPlaying, showRealTimeVisualization])

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return

    if (isPlaying) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error)
        })
      }

      // Resume audio context if it was suspended
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }
    } else {
      audioRef.current.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isLoaded])

  // Draw waveform
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    // Set canvas dimensions accounting for device pixel ratio
    canvas.width = rect.width * dpr
    canvas.height = height * dpr

    // Scale context for high DPI displays
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, height)

    const totalBars = Math.floor(rect.width / (barWidth + barGap))
    const barHeightMultiplier = height * 0.8

    // Use real-time data if available and playing, otherwise use static data
    const dataToUse = showRealTimeVisualization && isPlaying && realTimeData.length > 0 ? realTimeData : audioData

    if (!dataToUse.length) return

    // Create gradient if enabled
    let gradient = null
    let progressGradient = null

    if (useGradient) {
      gradient = ctx.createLinearGradient(0, 0, rect.width, 0)
      gradient.addColorStop(0, gradientColors[0])
      gradient.addColorStop(1, gradientColors[1])

      progressGradient = ctx.createLinearGradient(0, 0, rect.width, 0)
      progressGradient.addColorStop(0, progressColor)
      progressGradient.addColorStop(1, "#6665A2") // Signal Purple
    }

    // Draw each bar
    for (let i = 0; i < totalBars; i++) {
      // Use available data or interpolate
      const dataIndex = Math.floor((i * dataToUse.length) / totalBars)
      let amplitude = dataToUse[dataIndex] || 0.2

      // Add some animation for real-time visualization
      if (showRealTimeVisualization && isPlaying) {
        amplitude = Math.max(amplitude, audioLevel * 0.5)
      }

      const barHeight = Math.max(4, amplitude * barHeightMultiplier)
      const x = i * (barWidth + barGap)
      const y = (height - barHeight) / 2

      // Calculate progress position
      const progress = duration > 0 ? currentTime / duration : 0
      const isActive = i / totalBars < progress

      // Set color based on playback progress and gradient option
      if (useGradient) {
        ctx.fillStyle = isActive ? progressGradient || progressColor : gradient || barColor
      } else {
        ctx.fillStyle = isActive ? progressColor : barColor
      }

      // Add glow effect for active bars during playback
      if (isActive && isPlaying) {
        ctx.shadowColor = progressColor
        ctx.shadowBlur = 4
      } else {
        ctx.shadowBlur = 0
      }

      // Draw rounded bar
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [barWidth / 2])
      ctx.fill()
    }
  }, [
    audioData,
    realTimeData,
    barWidth,
    barGap,
    barColor,
    progressColor,
    height,
    currentTime,
    duration,
    useGradient,
    gradientColors,
    isPlaying,
    showRealTimeVisualization,
    audioLevel,
  ])

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="w-full cursor-pointer transition-opacity duration-200 hover:opacity-80"
        style={{ height: `${height}px` }}
        onClick={(e) => {
          if (!audioRef.current || !isLoaded) return

          // Calculate position click
          const rect = e.currentTarget.getBoundingClientRect()
          const clickPosition = (e.clientX - rect.left) / rect.width

          // Set audio position
          audioRef.current.currentTime = clickPosition * duration
        }}
        aria-label="Audio waveform - click to seek"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
      />
    </div>
  )
}
