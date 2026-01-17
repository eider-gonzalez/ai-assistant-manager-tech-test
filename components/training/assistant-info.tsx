"use client"

import { Bot, ArrowLeft, Volume2, Globe, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Assistant } from "@/types/assistant"
import Link from "next/link"

interface AssistantInfoProps {
  assistant: Assistant
}

const toneColors: Record<string, string> = {
  Formal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Casual: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Profesional: "bg-primary/20 text-primary border-primary/30",
  Amigable: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

const languageFlags: Record<string, string> = {
  Español: "🇪🇸",
  Inglés: "🇺🇸",
  Portugués: "🇧🇷",
}

function AssistantInfo( { assistant }: AssistantInfoProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{assistant.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                {languageFlags[assistant.language]} {assistant.language}
              </span>
              <span className="text-border">•</span>
              <Badge variant="outline" className={`${toneColors[assistant.tone]} text-xs`}>
                {assistant.tone}
              </Badge>
              {assistant.audioEnabled && (
                <>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5" />
                    Audio
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-0">
          <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            Respuestas: {assistant.responseLength.short}% / {assistant.responseLength.medium}% /{" "}
            {assistant.responseLength.long}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssistantInfo