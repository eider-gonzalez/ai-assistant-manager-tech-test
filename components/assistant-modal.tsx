"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, ChevronLeft, ChevronRight, Volume2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useAssistantStore } from "@/store/assistant-store"
import { useCreateAssistant, useUpdateAssistant } from "@/hooks/use-assistants"
import type { Assistant } from "@/types/assistant"

interface FormData {
  name: string
  language: Assistant["language"]
  tone: Assistant["tone"]
  responseLength: {
    short: number
    medium: number
    long: number
  }
  audioEnabled: boolean
}

const languages: Assistant["language"][] = ["Español", "Inglés", "Portugués"]
const tones: Assistant["tone"][] = ["Formal", "Casual", "Profesional", "Amigable"]

function AssistantModal() {
  const { isModalOpen, modalMode, modalStep, selectedAssistant, closeModal, setModalStep } = useAssistantStore()

  const createAssistant = useCreateAssistant()
  const updateAssistant = useUpdateAssistant()

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      language: "Español",
      tone: "Profesional",
      responseLength: { short: 33, medium: 34, long: 33 },
      audioEnabled: false,
    },
  })

  const responseLength = watch("responseLength")
  const [step1Valid, setStep1Valid] = useState(false)
  const name = watch("name")
  const language = watch("language")
  const tone = watch("tone")

  // Validate step 1
  useEffect(() => {
    const isValid = name.length >= 3 && !!language && !!tone
    setStep1Valid(isValid)
  }, [name, language, tone])

  // Restablecer formulario cuando se abre/cierra la ventana modal o cambia el modo
  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === "edit" && selectedAssistant) {
        reset({
          name: selectedAssistant.name,
          language: selectedAssistant.language,
          tone: selectedAssistant.tone,
          responseLength: selectedAssistant.responseLength,
          audioEnabled: selectedAssistant.audioEnabled,
        })
      } else {
        reset({
          name: "",
          language: undefined,
          tone: undefined,
          responseLength: { short: 33, medium: 34, long: 33 },
          audioEnabled: false,
        })
      }
    }
  }, [isModalOpen, modalMode, selectedAssistant, reset])

  // Calculate the sum of response lengths
  const totalPercentage = responseLength.short + responseLength.medium + responseLength.long
  const isValidPercentage = totalPercentage === 100

  // Handle slider changes with auto-balancing
  const handleSliderChange = (type: "short" | "medium" | "long", value: number[]) => {
    const newValue = value[0]
    const currentValues = { ...responseLength }
    const oldValue = currentValues[type]
    const diff = newValue - oldValue

    // Determinar qué otros sliders ajustar
    const others = (["short", "medium", "long"] as const).filter((t) => t !== type)

    // Calcular cuánto podemos tomar de otros sliders
    const otherTotal = others.reduce((sum, t) => sum + currentValues[t], 0)

    if (diff > 0 && otherTotal > 0) {
      // Tomar de los demás - distribuir proporcionalmente
      others.forEach((t) => {
        const proportion = currentValues[t] / otherTotal
        const adjustment = Math.round(diff * proportion)
        currentValues[t] = Math.max(0, currentValues[t] - adjustment)
      })
    } else if (diff < 0) {
      // Dar a los demás - distribuir igualmente
      const perOther = Math.abs(diff) / others.length
      others.forEach((t) => {
        currentValues[t] = Math.min(100, currentValues[t] + perOther)
      })
    }

    currentValues[type] = newValue

    // Asegúrese de que el total sea exactamente 100
    const newTotal = currentValues.short + currentValues.medium + currentValues.long
    if (newTotal !== 100) {
      const correction = 100 - newTotal
      // Aplicar corrección al primer slider que no sea el actual que pueda aceptar
      for (const t of others) {
        if (currentValues[t] + correction >= 0 && currentValues[t] + correction <= 100) {
          currentValues[t] += correction
          break
        }
      }
    }

    setValue("responseLength", {
      short: Math.round(currentValues.short),
      medium: Math.round(currentValues.medium),
      long: Math.round(currentValues.long),
    })
  }

  const handleNextStep = async () => {
    // Validar campos de paso 1 antes de proceder
    const isValid = await trigger(["name"])
    if (!isValid || !step1Valid) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }
    setModalStep(2)
  }

  const handlePrevStep = () => {
    setModalStep(1)
  }

  const handleSave = async () => {
    if (!isValidPercentage) {
      toast.error("La suma de los porcentajes debe ser exactamente 100%")
      return
    }

    const data = {
      name,
      language,
      tone,
      responseLength,
      audioEnabled: watch("audioEnabled"),
    }

    try {
      if (modalMode === "edit" && selectedAssistant) {
        await updateAssistant.mutateAsync({
          id: selectedAssistant.id,
          data: {
            name: data.name,
            language: data.language,
            tone: data.tone,
            responseLength: data.responseLength,
            audioEnabled: data.audioEnabled,
          },
        })
        toast.success("Asistente actualizado", {
          description: `"${data.name}" ha sido actualizado correctamente.`,
        })
      } else {
        await createAssistant.mutateAsync({
          name: data.name,
          language: data.language,
          tone: data.tone,
          responseLength: data.responseLength,
          audioEnabled: data.audioEnabled,
          rules: "",
        })
        toast.success("Asistente creado", {
          description: `"${data.name}" ha sido creado correctamente.`,
        })
      }
      closeModal()
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "No se pudo guardar el asistente.",
      })
    }
  }

  const isPending = createAssistant.isPending || updateAssistant.isPending

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="border-border bg-card sm:max-w-125 p-4">
        <DialogHeader>
          <DialogTitle>{modalMode === "create" ? "Crear Asistente" : "Editar Asistente"}</DialogTitle>
          <DialogDescription>
            {modalStep === 1 ? "Configura los datos básicos del asistente" : "Configura las respuestas del asistente"}
          </DialogDescription>
        </DialogHeader>

        {/* indicador de paso */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${modalStep === 1 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              }`}
          >
            1
          </div>
          <div className="h-0.5 w-12 bg-border">
            <div className={`h-full bg-primary transition-all ${modalStep === 2 ? "w-full" : "w-0"}`} />
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${modalStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
          >
            2
          </div>
        </div>

        <div>
          {modalStep === 1 ? (
            <div className="space-y-4 py-4">
              {/* nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del asistente <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ej: Asistente de Ventas"
                  {...register("name", {
                    required: "El nombre es requerido",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  })}
                  className="bg-input"
                  autoComplete="off"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              {/* lenguaje */}
              <div className="space-y-2">
                <Label>
                  Idioma <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={language}
                  onValueChange={(value) => setValue("language", value as Assistant["language"])}
                >
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* tono */}
              <div className="space-y-2">
                <Label>
                  Tono <span className="text-destructive">*</span>
                </Label>
                <Select value={tone} onValueChange={(value) => setValue("tone", value as Assistant["tone"])}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Selecciona un tono" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t} >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* longitud de respuestas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    Longitud de respuestas <span className="text-destructive">*</span>
                  </Label>
                  <span className={`text-sm font-medium ${isValidPercentage ? "text-primary" : "text-destructive"}`}>
                    Total: {totalPercentage}%
                  </span>
                </div>

                <div className="space-y-4">
                  {/* cortas */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cortas</span>
                      <span className="font-medium">{responseLength.short}%</span>
                    </div>
                    <Slider
                      value={[responseLength.short]}
                      onValueChange={(value) => handleSliderChange("short", value)}
                      max={100}
                      step={1}
                    />
                  </div>

                  {/* medias */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Medias</span>
                      <span className="font-medium">{responseLength.medium}%</span>
                    </div>
                    <Slider
                      value={[responseLength.medium]}
                      onValueChange={(value) => handleSliderChange("medium", value)}
                      max={100}
                      step={1}
                    />
                  </div>

                  {/* largas */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Largas</span>
                      <span className="font-medium">{responseLength.long}%</span>
                    </div>
                    <Slider
                      value={[responseLength.long]}
                      onValueChange={(value) => handleSliderChange("long", value)}
                      max={100}
                    />
                  </div>
                </div>

                {!isValidPercentage && (
                  <p className="text-sm text-destructive">La suma de los porcentajes debe ser exactamente 100%</p>
                )}
              </div>

              {/* audio habilitado */}
              <div className="flex items-center space-x-3 rounded-lg border border-border bg-input/50 p-4">
                <Checkbox
                  id="audioEnabled"
                  checked={watch("audioEnabled")}
                  onCheckedChange={(checked) => setValue("audioEnabled", checked as boolean)}
                />
                <div className="flex flex-1 items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="audioEnabled" className="cursor-pointer font-normal">
                    Habilitar respuestas de audio
                  </Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            {modalStep === 2 && (
              <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Atrás
              </Button>
            )}
            {modalStep === 1 ? (
              <Button type="button" onClick={handleNextStep} disabled={!step1Valid}>
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSave} disabled={isPending || !isValidPercentage}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AssistantModal