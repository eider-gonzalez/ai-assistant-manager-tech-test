"use client"

import { Bot, MessageSquare, MoreVertical, Pencil, Trash2, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Assistant } from "@/types/assistant"
import { useAssistantStore } from "@/store/assistant-store"
import Link from "next/link"

interface AssistantCardProps {
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

function AssistantCard({ assistant }: AssistantCardProps) {
  const { openModal, setAssistantToDelete } = useAssistantStore()

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{assistant.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>{languageFlags[assistant.language]}</span>
              <span>{assistant.language}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => openModal("edit", assistant)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/assistant/${assistant.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Entrenar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setAssistantToDelete(assistant)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={toneColors[assistant.tone]}>
            {assistant.tone}
          </Badge>
          {assistant.audioEnabled && (
            <Badge variant="outline" className="border-muted-foreground/30 bg-muted/50 text-muted-foreground">
              <Volume2 className="mr-1 h-3 w-3" />
              Audio
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Distribución de respuestas</p>
          <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="bg-primary/80 transition-all"
              style={{ width: `${assistant.responseLength.short}%` }}
              title={`Cortas: ${assistant.responseLength.short}%`}
            />
            <div
              className="bg-primary/50 transition-all"
              style={{ width: `${assistant.responseLength.medium}%` }}
              title={`Medias: ${assistant.responseLength.medium}%`}
            />
            <div
              className="bg-primary/30 transition-all"
              style={{ width: `${assistant.responseLength.long}%` }}
              title={`Largas: ${assistant.responseLength.long}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Cortas {assistant.responseLength.short}%</span>
            <span>Medias {assistant.responseLength.medium}%</span>
            <span>Largas {assistant.responseLength.long}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssistantCard