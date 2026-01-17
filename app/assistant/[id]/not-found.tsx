import { Bot, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Bot className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">Asistente no encontrado</h1>
      <p className="mt-2 text-center text-muted-foreground">El asistente que buscas no existe o ha sido eliminado.</p>
      <Button asChild className="mt-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>
    </div>
  )
}

export default NotFound