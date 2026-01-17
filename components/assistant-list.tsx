"use client"

import { useAssistants } from "@/hooks/use-assistants"
import AssistantCardSkeleton from "./assistant-card-skeleton"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import EmptyState from "./empty-state"
import AssistantCard from "./assistant-card"

function AssistantList() {
  const { data: assistants, isLoading, isError, refetch } = useAssistants()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <AssistantCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">Error al cargar</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No se pudieron cargar los asistentes. Por favor, intenta de nuevo.
        </p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  if (!assistants || assistants.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assistants.map((assistant) => (
        <AssistantCard key={assistant.id} assistant={assistant} />
      ))}
    </div>
  )
}

export default AssistantList