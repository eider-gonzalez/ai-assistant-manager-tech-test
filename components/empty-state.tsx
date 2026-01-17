"use client"

import { Bot, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAssistantStore } from "@/store/assistant-store"

function EmptyState() {
  const { openModal } = useAssistantStore()

  return (
    <div className="flex min-h-400px flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-card/30 px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-foreground">No hay asistentes</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Comienza creando tu primer asistente IA para automatizar las interacciones con tus leads.
      </p>
      <Button onClick={() => openModal("create")} className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Crear Asistente
      </Button>
    </div>
  )
}

export default EmptyState