import type { Assistant } from "@/types/assistant"
import { initialAssistants } from "./mock-data"

// Almacenamiento en memoria de asistentes
let assistantsStore: Assistant[] = [...initialAssistants]

// Simular retraso de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Retraso aleatorio entre 100-500ms
const randomDelay = () => delay(100 + Math.random() * 400)

// 10% de probabilidad de error para operaciones de eliminación
const shouldFail = () => Math.random() < 0.1

export const assistantService = {
  // Obtener todos los asistentes
  getAll: async (): Promise<Assistant[]> => {
    await randomDelay()
    return [...assistantsStore]
  },

  // Obtener un asistente individual por ID
  getById: async (id: string): Promise<Assistant | null> => {
    await randomDelay()
    return assistantsStore.find((a) => a.id === id) || null
  },

  // Crear nuevo asistente
  create: async (assistant: Omit<Assistant, "id">): Promise<Assistant> => {
    await randomDelay()
    const newAssistant: Assistant = {
      ...assistant,
      id: Date.now().toString(),
    }
    assistantsStore.push(newAssistant)
    return newAssistant
  },

  // Actualizar asistente existente
  update: async (id: string, data: Partial<Assistant>): Promise<Assistant> => {
    await randomDelay()
    const index = assistantsStore.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error("Asistente no encontrado")
    }
    assistantsStore[index] = { ...assistantsStore[index], ...data }
    return assistantsStore[index]
  },

  // Eliminar asistente (10% de probabilidad de error)
  delete: async (id: string): Promise<void> => {
    await randomDelay()
    if (shouldFail()) {
      throw new Error("Error al eliminar el asistente. Por favor, intenta de nuevo.")
    }
    assistantsStore = assistantsStore.filter((a) => a.id !== id)
  },

  // Actualizar reglas/entrenamiento
  updateRules: async (id: string, rules: string): Promise<Assistant> => {
    await randomDelay()
    const index = assistantsStore.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error("Asistente no encontrado")
    }
    assistantsStore[index].rules = rules
    return assistantsStore[index]
  },
}
