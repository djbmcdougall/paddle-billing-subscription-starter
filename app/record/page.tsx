"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Pause, Play, ImageIcon, MapPin, LinkIcon, Loader2, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcribedText, setTranscribedText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [url, setUrl] = useState("")
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState("es")

  const { toast } = useToast()
  const router = useRouter()

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setIsPaused(false)
      // Reset transcription when starting a new recording
      setTranscribedText("")
      setTranslatedText("")
    } else {
      setIsRecording(false)
      setIsPaused(false)
      // Simulate transcription after recording stops
      handleTranscribe()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
        // Update progress for visual feedback
        setRecordingProgress((prev) => Math.min(prev + 1, 100))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, isPaused])

  const handleTranscribe = async () => {
    if (isRecording) return

    setIsTranscribing(true)

    // Simulate API call for transcription
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock transcription result
      const mockTranscription =
        "I just visited this amazing coffee shop downtown. The atmosphere was cozy and the staff was super friendly. Their caramel latte is to die for, and they have these amazing pastries that are baked fresh daily. The WiFi is fast and reliable, making it a perfect spot for remote work. Highly recommend checking it out if you're in the area!"

      setTranscribedText(mockTranscription)

      toast({
        title: "Transcription complete",
        description: "Your audio has been transcribed successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleTranslate = async () => {
    if (!transcribedText || isTranslating) return

    setIsTranslating(true)

    // Simulate API call for translation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock translation results based on selected language
      const translations: Record<string, string> = {
        es: "Acabo de visitar esta increíble cafetería en el centro. El ambiente era acogedor y el personal muy amable. Su latte de caramelo está para morirse, y tienen unos pasteles increíbles que se hornean frescos a diario. El WiFi es rápido y confiable, lo que lo convierte en un lugar perfecto para trabajar de forma remota. ¡Recomiendo encarecidamente visitarlo si estás en la zona!",
        fr: "Je viens de visiter ce café incroyable au centre-ville. L'ambiance était chaleureuse et le personnel très sympathique. Leur latte au caramel est à mourir d'envie, et ils ont ces incroyables pâtisseries qui sont cuites fraîchement chaque jour. Le WiFi est rapide et fiable, ce qui en fait un endroit parfait pour le travail à distance. Je recommande vivement d'y faire un tour si vous êtes dans le coin !",
        de: "Ich habe gerade dieses erstaunliche Café in der Innenstadt besucht. Die Atmosphäre war gemütlich und das Personal sehr freundlich. Ihr Karamell-Latte ist zum Sterben gut, und sie haben diese erstaunlichen Gebäcke, die täglich frisch gebacken werden. Das WLAN ist schnell und zuverlässig, was es zu einem perfekten Ort für Remote-Arbeit macht. Sehr zu empfehlen, wenn Sie in der Gegend sind!",
      }

      setTranslatedText(translations[targetLanguage] || "Translation not available for this language.")

      toast({
        title: "Translation complete",
        description: `Your text has been translated to ${getLanguageName(targetLanguage)}.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "There was an error translating your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      ar: "Arabic",
    }
    return languages[code] || code
  }

  const handlePublish = async () => {
    if (!transcribedText.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Murmur published!",
        description: "Your voice recommendation has been shared successfully.",
        variant: "success",
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      toast({
        title: "Error publishing murmur",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl px-4 py-8 pb-20">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Record a Murmur</h1>
        <p className="text-muted-foreground">Share your authentic recommendation</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10 relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 bg-secondary/30 w-full transition-all duration-300"
                    style={{ height: `${recordingProgress}%` }}
                  />
                </div>
              )}
              {isRecording ? (
                <div className="relative z-10">
                  <div className="absolute inset-0 animate-ping rounded-full bg-secondary/20"></div>
                  {isPaused ? (
                    <MicOff className="h-12 w-12 text-secondary" />
                  ) : (
                    <Mic className="h-12 w-12 text-secondary" />
                  )}
                </div>
              ) : (
                <Mic className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="mb-2 text-2xl font-mono">{formatTime(recordingTime)}</div>

            <div className="flex space-x-2">
              <Button variant={isRecording ? "outline" : "secondary"} onClick={toggleRecording}>
                {isRecording ? "Stop" : "Start Recording"}
              </Button>

              {isRecording && (
                <Button variant="outline" onClick={togglePause}>
                  {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="transcription" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transcription">Transcription</TabsTrigger>
              <TabsTrigger value="translation">Translation</TabsTrigger>
            </TabsList>

            <TabsContent value="transcription" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="transcription">Your recommendation</Label>
                <Button variant="outline" size="sm" onClick={handleTranscribe} disabled={isRecording || isTranscribing}>
                  {isTranscribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    "Transcribe"
                  )}
                </Button>
              </div>
              <Textarea
                id="transcription"
                placeholder="Tap the microphone to start recording your recommendation..."
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </TabsContent>

            <TabsContent value="translation" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="language" className="mr-2">
                    Translate to:
                  </Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTranslate}
                  disabled={!transcribedText || isTranslating}
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="mr-2 h-4 w-4" />
                      Translate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="translation"
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                className="min-h-[120px] resize-none bg-muted/30"
              />
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="location">Location (optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Add a location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="url">URL (optional)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="Add a link (e.g., website, menu, booking page)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label>Add photos (optional)</Label>
              <div className="mt-2 flex items-center space-x-2">
                <Button variant="outline" className="h-20 w-20">
                  <ImageIcon className="h-6 w-6" />
                </Button>
                {/* Photo preview would go here */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button
          disabled={!transcribedText.trim() || isSubmitting}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handlePublish}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </div>
  )
}
