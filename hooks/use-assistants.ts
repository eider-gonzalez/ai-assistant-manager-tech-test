import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { assistantService } from "@/lib/mock-services"
import type { Assistant } from "@/types/assistant"
import { useAssistantStore } from "@/store/assistant-store"

// clave de consulta
export const ASSISTANTS_KEY = ["assistants"]

// Obtener todos los asistentes
export const useAssistants = () => {
  return useQuery({
    queryKey: ASSISTANTS_KEY,
    queryFn: assistantService.getAll,
  })
}

// Obtener un asistente individual
export const useAssistant = (id: string) => {
  return useQuery({
    queryKey: [...ASSISTANTS_KEY, id],
    queryFn: () => assistantService.getById(id),
    enabled: !!id,
  })
}

// Crear asistente mutation
export const useCreateAssistant = () => {
  const queryClient = useQueryClient()
  const { closeModal } = useAssistantStore()

  return useMutation({
    mutationFn: (data: Omit<Assistant, "id">) => assistantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANTS_KEY })
      closeModal()
    },
  })
}

// Actualizar asistente mutation
export const useUpdateAssistant = () => {
  const queryClient = useQueryClient()
  const { closeModal } = useAssistantStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assistant> }) => assistantService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancelar consultas salientes
      await queryClient.cancelQueries({ queryKey: ASSISTANTS_KEY })

      // Capturar valor anterior
      const previousAssistants = queryClient.getQueryData<Assistant[]>(ASSISTANTS_KEY)

      // Actualización optimista
      queryClient.setQueryData<Assistant[]>(ASSISTANTS_KEY, (old) =>
        old?.map((a) => (a.id === id ? { ...a, ...data } : a)),
      )

      return { previousAssistants }
    },
    onError: (_err, _variables, context) => {
      // Rollback en caso de error
      if (context?.previousAssistants) {
        queryClient.setQueryData(ASSISTANTS_KEY, context.previousAssistants)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANTS_KEY })
      closeModal()
    },
  })
}

// Eliminar asistente mutation
export const useDeleteAssistant = () => {
  const queryClient = useQueryClient()
  const { setAssistantToDelete } = useAssistantStore()

  return useMutation({
    mutationFn: (id: string) => assistantService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ASSISTANTS_KEY })
      const previousAssistants = queryClient.getQueryData<Assistant[]>(ASSISTANTS_KEY)

      // Actualización optimista
      queryClient.setQueryData<Assistant[]>(ASSISTANTS_KEY, (old) => old?.filter((a) => a.id !== id))

      return { previousAssistants }
    },
    onError: (_err, _id, context) => {
      // Rollback en caso de error
      if (context?.previousAssistants) {
        queryClient.setQueryData(ASSISTANTS_KEY, context.previousAssistants)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANTS_KEY })
      setAssistantToDelete(null)
    },
  })
}

// Actualizar reglas mutation
export const useUpdateRules = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, rules }: { id: string; rules: string }) => assistantService.updateRules(id, rules),
    onSuccess: (updatedAssistant) => {
      queryClient.setQueryData<Assistant[]>(ASSISTANTS_KEY, (old) =>
        old?.map((a) => (a.id === updatedAssistant.id ? updatedAssistant : a)),
      )
      queryClient.invalidateQueries({ queryKey: [...ASSISTANTS_KEY, updatedAssistant.id] })
    },
  })
}
