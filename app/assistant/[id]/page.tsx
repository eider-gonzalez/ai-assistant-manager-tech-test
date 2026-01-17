"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAssistant } from "@/hooks/use-assistants"
import AssistantInfo from "@/components/training/assistant-info"
import RulesEditor from "@/components/training/rules-editor"
import ChatSimulator from "@/components/training/chat-simulator"


function TrainingPage() {
  const params = useParams()
  const id = params.id as string

  const { data: assistant, isLoading, isError } = useAssistant(id)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando asistente...</p>
        </div>
      </div>
    )
  }

  if (isError || !assistant) {
    notFound()
  }


  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto space-y-6 px-4 py-6">
        <AssistantInfo assistant={assistant} />
        <div className="grid gap-6 lg:grid-cols-2">
          <RulesEditor assistant={assistant} />
          <ChatSimulator assistant={assistant} />
        </div>
      </main>
    </div>
  )
}

export default TrainingPage