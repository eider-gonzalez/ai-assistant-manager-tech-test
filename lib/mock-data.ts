import type { Assistant } from "@/types/assistant"

export const initialAssistants: Assistant[] = [
  {
    id: "1",
    name: "Asistente de Ventas",
    language: "Español",
    tone: "Profesional",
    responseLength: {
      short: 30,
      medium: 50,
      long: 20,
    },
    audioEnabled: true,
    rules:
      "Eres un asistente especializado en ventas. Siempre sé cordial y enfócate en identificar necesidades del cliente antes de ofrecer productos.",
  },
  {
    id: "2",
    name: "Technical Support",
    language: "Inglés",
    tone: "Amigable",
    responseLength: {
      short: 20,
      medium: 30,
      long: 50,
    },
    audioEnabled: false,
    rules:
      "You help resolve technical problems clearly and step by step.Always confirm that the user understands before continuing",
  },
  {
    id: "3",
    name: "Assistente Financeiro",
    language: "Portugués",
    tone: "Casual",
    responseLength: {
      short: 20,
      medium: 30,
      long: 50,
    },
    audioEnabled: false,
    rules:
      "Aconselhar os clientes sobre suas necessidades financeiras. Manter um tom profissional, porém acessível, e garantir que os clientes tenham todas as informações necessárias para tomar decisões bem fundamentadas.",
  },
]

export const simulatedResponsesByLanguage: Record<string, string[]> = {
  Español: [
    "Entendido, ¿en qué más puedo ayudarte?",
    "Esa es una excelente pregunta. Déjame explicarte...",
    "Claro, con gusto te ayudo con eso.",
    "¿Podrías darme más detalles sobre tu consulta?",
  ],
  Inglés: [
    "Understood, how else can I help you?",
    "That's an excellent question. Let me explain...",
    "Sure, I can help you with that.",
    "Could you provide more details about your request?",
  ],
  Portugués: [
    "Entendido. Como posso ajudar?",
    "Essa é uma ótima pergunta. Deixe-me explicar...",
    "Claro, posso ajudá-lo com isso.",
    "Você poderia me fornecer mais detalhes sobre sua solicitação?",
  ],
}

export const getRandomResponse = (language: string): string => {
  const responses = simulatedResponsesByLanguage[language]

  if (!responses || responses.length === 0) {
    return "..."
  }

  return responses[Math.floor(Math.random() * responses.length)]
}