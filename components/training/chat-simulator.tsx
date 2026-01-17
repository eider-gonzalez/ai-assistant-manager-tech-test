"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, RotateCcw, Bot, User, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssistantStore } from "@/store/assistant-store"
import { getRandomResponse } from "@/lib/mock-data"
import type { Assistant, ChatMessage } from "@/types/assistant"

interface ChatSimulatorProps {
  assistant: Assistant
}

function ChatSimulator( { assistant }: ChatSimulatorProps) {
  const { chatHistory, addChatMessage, clearChatHistory } = useAssistantStore()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const messages = chatHistory[assistant.id] || []

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus()
    }
  }, [isTyping])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    addChatMessage(assistant.id, userMessage)
    setInput("")
    setIsTyping(true)

    const delay = 1000 + Math.random() * 1000
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getRandomResponse(assistant.language),
        timestamp: new Date(),
      }
      addChatMessage(assistant.id, assistantMessage)
      setIsTyping(false)
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    clearChatHistory(assistant.id)
    inputRef.current?.focus()
  }

  return (
    <Card className="flex h-125 flex-col border-border/50 bg-card">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Chat Simulado</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={messages.length === 0 && !isTyping}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Reiniciar
          </Button>
        </div>
        <CardDescription>Prueba cómo responde el asistente a diferentes mensajes.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden  ">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto rounded-lg border border-border/50 bg-input/30 p-4 scrollbar-thin scrollbar-primary"
        >
          {messages.length === 0 && !isTyping ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="space-y-2">
                <Bot className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Envía un mensaje para comenzar la conversación</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user" ? "bg-secondary" : "bg-primary/10"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-secondary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Escribiendo...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="bg-input"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatSimulator