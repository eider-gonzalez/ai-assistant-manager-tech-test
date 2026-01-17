"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAssistantStore } from "@/store/assistant-store"
import { useDeleteAssistant } from "@/hooks/use-assistants"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

function DeleteConfirmationDialog() {
  const { assistantToDelete, setAssistantToDelete } = useAssistantStore()
  const deleteAssistant = useDeleteAssistant()

  const handleDelete = async () => {
    if (!assistantToDelete) return

    try {
      await deleteAssistant.mutateAsync(assistantToDelete.id)
      toast.success("Asistente eliminado", {
        description: `"${assistantToDelete.name}" ha sido eliminado correctamente.`,
      })
    } catch (error) {
      toast.error("Error al eliminar", {
        description: error instanceof Error ? error.message : "No se pudo eliminar el asistente.",
      })
    }
  }

  return (
    <AlertDialog open={!!assistantToDelete} onOpenChange={(open) => !open && setAssistantToDelete(null)}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar asistente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el asistente
            <span className="font-medium text-foreground"> {assistantToDelete?.name}</span> y toda su configuración.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAssistant.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAssistant.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteAssistant.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationDialog