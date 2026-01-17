"use client"

import { useState } from "react"
import { FileText, Loader2, Save, Check } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateRules } from "@/hooks/use-assistants"
import type { Assistant } from "@/types/assistant"

interface RulesEditorProps {
  assistant: Assistant
}

function RulesEditor({ assistant }: RulesEditorProps) {
  const [rules, setRules] = useState(assistant.rules)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const updateRules = useUpdateRules()

  const handleChange = (value: string) => {
    setRules(value)
    setHasChanges(value !== assistant.rules)
    setShowSaved(false)
  }

  const handleSave = async () => {
    try {
      await updateRules.mutateAsync({ id: assistant.id, rules })
      setHasChanges(false)
      setShowSaved(true)
      toast.success("Entrenamiento guardado", {
        description: "Las reglas del asistente han sido actualizadas.",
      })
      // Hide the saved indicator after 3 seconds
      setTimeout(() => setShowSaved(false), 3000)
    } catch (error) {
      toast.error("Error al guardar", {
        description: error instanceof Error ? error.message : "No se pudieron guardar las reglas.",
      })
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Entrenamiento</CardTitle>
          </div>
          {showSaved && (
            <span className="flex items-center gap-1 text-sm text-primary">
              <Check className="h-4 w-4" />
              Guardado
            </span>
          )}
        </div>
        <CardDescription>
          Define las reglas e instrucciones que guiarán el comportamiento del asistente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={rules}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Escribe las instrucciones y reglas para el asistente...
            Ejemplo:
            - Eres un asistente especializado en ventas
            - Siempre saluda cordialmente
            - Identifica las necesidades del cliente antes de ofrecer productos
            - Mantén un tono profesional pero cercano"
          className="min-h-50 resize-none bg-input"
        />
        <Button onClick={handleSave} disabled={!hasChanges || updateRules.isPending} className="w-full sm:w-auto">
          {updateRules.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Entrenamiento
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default RulesEditor