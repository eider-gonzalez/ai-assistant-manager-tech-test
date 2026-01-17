"use client"

import { Bot, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAssistantStore } from "@/store/assistant-store"

function Header() {
  const { openModal } = useAssistantStore()

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Asistentes IA</h1>
            <p className="text-xs text-muted-foreground">Gestión de asistentes</p>
          </div>
        </div>
        <Button onClick={() => openModal("create")} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Crear Asistente
        </Button>
      </div>
    </header>
  )
}

export default Header