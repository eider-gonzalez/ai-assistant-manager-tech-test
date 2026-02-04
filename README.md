# Módulo de Gestión de Asistentes IA

## 📌 Descripción

Este proyecto es una aplicación web desarrollada como prueba técnica para Funnelhot. Permite crear, editar, eliminar y entrenar asistentes de IA, simulando un sistema profesional de gestión de asistentes para automatizar interacciones con leads.

La aplicación está construida con **Next.js (App Router)**, **TypeScript**, **Zustand** y **React Query**, utilizando servicios mock en memoria para simular operaciones CRUD y entrenamiento.

---

## 🚀 Tecnologías utilizadas

- **Next.js (App Router)** – Framework principal
- **React + TypeScript** – UI tipada y mantenible
- **Tailwind CSS** – Estilos utilitarios y diseño responsive
- **shadcn/ui** – Sistema de componentes reutilizables construido sobre Radix UI
- **Radix UI** – Primitivos accesibles (Dialog, Select, Dropdown, etc.)
- **Zustand** – Estado global (UI, modal, asistente seleccionado, chat)
- **TanStack React Query** – Manejo de estado asíncrono (fetch, mutations)
- **React Hook Form** – Manejo y validación de formularios
- **Sonner** – Sistema de notificaciones (toasts)
- **Lucide React** – Iconografía

---

## 📂 Arquitectura

La arquitectura separa claramente responsabilidades:

- **UI / Componentes** → Renderizado y experiencia de usuario
- **Zustand** → Estado global sincrónico y compartido
- **React Query** → Operaciones asíncronas y cache
- **Servicios mock** → Simulación de backend

Esto permite que el proyecto sea escalable y que los servicios mock puedan reemplazarse fácilmente por una API real.

---

## 🧠 Decisiones técnicas

### UI (shadcn/ui + Sonner)

Se utilizó **shadcn/ui** por su:

- Accesibilidad por defecto
- Diseño limpio y profesional
- Facilidad de personalización

Para feedback al usuario (errores, confirmaciones, éxito), se utilizó **Sonner**, permitiendo notificaciones claras y no intrusivas durante las operaciones CRUD y validaciones.

### Zustand

Se utiliza para manejar:

- Lista de asistentes en memoria
- Asistente seleccionado
- Estado del modal (abierto/cerrado, modo, paso)
- Historial del chat por asistente

Se eligió Zustand por su simplicidad, bajo boilerplate y facilidad para manejar estado global sincrónico.

### React Query

Se utiliza para:

- Obtener asistentes
- Crear, editar y eliminar asistentes
- Guardar entrenamiento

React Query gestiona automáticamente:

- Estados de carga
- Manejo de errores
- Invalidación de queries
- Optimistic updates

Esto mejora la UX y mantiene el código limpio.

### Servicios Mock

Las operaciones se simulan en memoria con:

- Delays artificiales (100–500ms)
- Probabilidad de error (por ejemplo, 10% al eliminar)

Esto permite demostrar manejo de estado y UX sin necesidad de backend real.

---

## 🧩 Funcionalidades implementadas

- Listado de asistentes con estados de carga y estado vacío
- Modal de creación/edición en 2 pasos con validaciones
- Eliminación con confirmación y feedback visual
- Página de entrenamiento por asistente
- Guardado de reglas de entrenamiento
- Chat simulado con:
  - Delay en respuestas
  - Indicador de "escribiendo"
  - Reinicio de conversación
- Diseño responsive (mobile / desktop)

---

## ⚠️ Consideraciones sobre persistencia

Los datos viven únicamente en memoria durante la sesión. Al refrescar la página, el estado vuelve a su valor inicial.

Esto es intencional y responde a los requerimientos de la prueba técnica.

---

## ▶️ Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

4. Abrir en el navegador:

```
http://localhost:3000
```

---

## 🧪 Qué se dejó fuera (priorización)

- Persistencia real en base de datos
- Autenticación
- Tests automatizados

Estas decisiones se tomaron para priorizar la calidad del manejo de estado, la arquitectura y la experiencia de usuario dentro del tiempo disponible.

---

## ⏱️ Tiempo de dedicación

Aproximadamente **8 horas**, incluyendo:

- Análisis de requerimientos
- Diseño de arquitectura
- Implementación
- Ajustes de UX y validaciones

---

## 🧑‍💻 Autor

Desarrollado por **Eider Andrés González Sánchez**.
