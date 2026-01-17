import { create } from "zustand"
import type { Assistant, ChatMessage, ModalMode } from "@/types/assistant"

// Store
interface AssistantState {
  // lista de asistentes
  selectedAssistant: Assistant | null
  setSelectedAssistant: (assistant: Assistant | null) => void

  // estado del modal
  isModalOpen: boolean
  modalMode: ModalMode
  modalStep: 1 | 2
  openModal: (mode: ModalMode, assistant?: Assistant) => void
  closeModal: () => void
  setModalStep: (step: 1 | 2) => void

  // historial de chat por asistente
  chatHistory: Record<string, ChatMessage[]>
  addChatMessage: (assistantId: string, message: ChatMessage) => void
  clearChatHistory: (assistantId: string) => void

  // confirmacion de eliminacion
  assistantToDelete: Assistant | null
  setAssistantToDelete: (assistant: Assistant | null) => void
}

// Zustand store
export const useAssistantStore = create<AssistantState>((set) => ({
  // seleccion de asistente
  selectedAssistant: null,
  setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),

  // estado del modal
  isModalOpen: false,
  modalMode: "create",
  modalStep: 1,
  openModal: (mode, assistant) =>
    set({
      isModalOpen: true,
      modalMode: mode,
      modalStep: 1,
      selectedAssistant: assistant || null,
    }),
  closeModal: () =>
    set({
      isModalOpen: false,
      modalStep: 1,
      selectedAssistant: null,
    }),
  setModalStep: (step) => set({ modalStep: step }),

  // historial de chat
  chatHistory: {},
  addChatMessage: (assistantId, message) =>
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [assistantId]: [...(state.chatHistory[assistantId] || []), message],
      },
    })),
  clearChatHistory: (assistantId) =>
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [assistantId]: [],
      },
    })),

  // confirmacion de eliminacion
  assistantToDelete: null,
  setAssistantToDelete: (assistant) => set({ assistantToDelete: assistant }),
}))
