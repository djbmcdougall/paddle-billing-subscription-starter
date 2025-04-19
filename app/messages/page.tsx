"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Send, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"

type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}

type Conversation = {
  userId: string
  userName: string
  userAvatar: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    // In a real app, this would fetch conversations from an API
    // For demo purposes, we'll use mock data
    const mockConversations: Conversation[] = [
      {
        userId: "2",
        userName: "Sarah Johnson",
        userAvatar: "/placeholder.svg?height=40&width=40&text=SJ",
        lastMessage: "Thanks for the recommendation!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
      },
      {
        userId: "3",
        userName: "Mike Chen",
        userAvatar: "/placeholder.svg?height=40&width=40&text=MC",
        lastMessage: "Have you tried that new restaurant downtown?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        unreadCount: 0,
      },
      {
        userId: "4",
        userName: "Emily Rodriguez",
        userAvatar: "/placeholder.svg?height=40&width=40&text=ER",
        lastMessage: "I loved your latest murmur about the hiking trail!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 0,
      },
    ]

    setConversations(mockConversations)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // In a real app, this would fetch messages from an API
      // For demo purposes, we'll use mock data
      const mockMessages: Message[] = [
        {
          id: "1",
          senderId: selectedConversation,
          receiverId: user?.id || "",
          content: "Hey, I saw your recommendation about Brew & Bean!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: true,
        },
        {
          id: "2",
          senderId: user?.id || "",
          receiverId: selectedConversation,
          content: "Yes! It's one of my favorite coffee shops. Have you been there?",
          timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
          read: true,
        },
        {
          id: "3",
          senderId: selectedConversation,
          receiverId: user?.id || "",
          content: "Not yet, but I'm planning to go this weekend. Any specific recommendations?",
          timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
          read: true,
        },
        {
          id: "4",
          senderId: user?.id || "",
          receiverId: selectedConversation,
          content: "Definitely try their caramel latte and the blueberry muffins. They're amazing!",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          read: true,
        },
        {
          id: "5",
          senderId: selectedConversation,
          receiverId: user?.id || "",
          content: "Thanks for the recommendation!",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
        },
      ]

      setMessages(mockMessages)

      // Mark conversation as read
      setConversations((prev) =>
        prev.map((conv) => (conv.userId === selectedConversation ? { ...conv, unreadCount: 0 } : conv)),
      )
    }
  }, [selectedConversation, user?.id])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "",
      receiverId: selectedConversation,
      content: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.userId === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              timestamp: new Date(),
            }
          : conv,
      ),
    )
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const selectedUser = conversations.find((c) => c.userId === selectedConversation)

  return (
    <ProtectedRoute>
      <div className="pb-16">
        <Header />

        <div className="container px-4 py-6">
          {selectedConversation && selectedUser ? (
            <div className="flex h-[calc(100vh-10rem)] flex-col">
              <div className="mb-4 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Image
                  src={selectedUser.userAvatar || "/placeholder.svg"}
                  alt={selectedUser.userName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h2 className="font-medium">{selectedUser.userName}</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto rounded-md border bg-background p-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id

                  return (
                    <div key={message.id} className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`mt-1 text-right text-xs ${
                            isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button className="ml-2" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">Messages</h1>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-9" />
                </div>

                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4 space-y-2">
                    {conversations.map((conversation) => (
                      <Card
                        key={conversation.userId}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          conversation.unreadCount > 0 ? "bg-muted/30" : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation.userId)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <div className="relative">
                              <Image
                                src={conversation.userAvatar || "/placeholder.svg"}
                                alt={conversation.userName}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              {conversation.unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{conversation.userName}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.timestamp)}
                                </span>
                              </div>
                              <p className="line-clamp-1 text-sm text-muted-foreground">{conversation.lastMessage}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="unread" className="mt-4 space-y-2">
                    {conversations
                      .filter((c) => c.unreadCount > 0)
                      .map((conversation) => (
                        <Card
                          key={conversation.userId}
                          className="cursor-pointer bg-muted/30 hover:bg-muted/50"
                          onClick={() => setSelectedConversation(conversation.userId)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center">
                              <div className="relative">
                                <Image
                                  src={conversation.userAvatar || "/placeholder.svg"}
                                  alt={conversation.userName}
                                  width={48}
                                  height={48}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                                  {conversation.unreadCount}
                                </span>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">{conversation.userName}</h3>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(conversation.timestamp)}
                                  </span>
                                </div>
                                <p className="line-clamp-1 text-sm text-muted-foreground">{conversation.lastMessage}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                    {conversations.filter((c) => c.unreadCount > 0).length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">No unread messages</div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="hidden md:col-span-2 md:flex md:items-center md:justify-center">
                <div className="text-center">
                  <div className="mb-4 text-muted-foreground">
                    <Image
                      src="/placeholder.svg?height=100&width=100&text=Messages"
                      alt="Messages"
                      width={100}
                      height={100}
                      className="mx-auto"
                    />
                  </div>
                  <h2 className="text-xl font-medium">Select a conversation</h2>
                  <p className="mt-1 text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
