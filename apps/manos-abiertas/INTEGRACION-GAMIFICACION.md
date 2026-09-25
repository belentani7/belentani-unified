# Integración de Gamificación — apps/manos-abiertas

Fecha: 2026-09-05

## Qué se integró (código muerto activado)

1. **QuizQuestion** (`src/components/manos-abiertas/course-ui/QuizQuestion.tsx`)
   - Ahora se usa en `learn-ai-section.tsx` (`LessonViewer`): al final de cada lección,
     tras el ejercicio, se renderiza un "Mini quiz" generado automáticamente.
   - Generación determinista y offline (`buildTipsQuiz`): pregunta "¿cuál de estos
     consejos corresponde a esta lección?" con la respuesta correcta = tips[0] de la
     lección y 3 distractores tomados de tips de otras lecciones del mismo curso.
     Shuffle con semilla basada en `lesson.id` (estable entre renders).
   - Respuesta correcta = +5 XP (`onQuizAnswer` → `gamification.addXp(5)`).

2. **GamificationPanel** (`course-ui/GamificationPanel.tsx`) + **useGamification**
   (`course-ui/useGamification.ts`)
   - Botón "Ver mi progreso y logros" en la vista principal de cursos (Aprender IA).
   - Panel con nivel, XP, racha, barra de progreso y logros. Se abre solo si ya hay XP.
   - `useGamification` (localStorage `manosabiertas-gamification`) ahora recibe eventos
     reales: `completeLesson()` al marcar lección, `completeCourse()` al terminar curso,
     `addXp(5)` en quiz correcto.

3. **Felicitaciones** (nuevo `src/data/congrat-pool.ts`)
   - 3 frases rotativas ES + 3 PT-BR (`getCongratsMessage`, rotación determinista según
     nº de lecciones completadas) y mensaje especial de curso completo ES/PT-BR.
   - Al pulsar "Marcar": `toast.success` (sonner) + lectura en voz alta con
     `useSpeech()`/`getSpeechLang()`.
   - Nota: NO existe un flag `voiceOn` global en el store; se habla siempre que el
     navegador soporte `speechSynthesis` (mismo criterio que `TTSButton`).

4. **Memoria de acompañamiento**
   - Al montar `LearnAISection`, si hay progreso previo (localStorage
     `manos-abiertas-ai-progress`), banner "Bienvenido de nuevo, continuaste X
     lecciones" (ES/PT-BR según idioma).

## Qué NO se integró (pendiente)

- **FlashCard** (`course-ui/FlashCard.tsx`): componente útil, pero no se encontró un
  lugar natural en `learn-ai-section` sin rediseñar la lección. Candidato: usar
  pregunta/respuesta con tips como tarjetas al final de lección.
- **CourseLayout** (`course-ui/CourseLayout.tsx`): layout de página completa con
  sidebar; reemplazarlo implicaría refactor grande del LessonViewer. No forzado.
- **useCourseProgress** (`course-ui/useCourseProgress.ts`): usa otra clave de
  almacenamiento (`course-progress-{id}`) y granularidad por curso. El flujo actual de
  `learn-ai-section` (Set global en `manos-abiertas-ai-progress`) funciona y no se
  migró para evitar riesgo. Migración futura: unificar en `useCourseProgress`.
- **generated-courses/** (5 cursos con unidades + quizzes): sistema paralelo de cursos
  que requiere un contenedor UI propio (no existe sección que los pinte). Pendiente de
  decidir dónde exponerlos.
- Panel de racha en la vista de detalle de curso (solo está en la vista principal).
- Sonido de felicitación respeta TTS actual: `useSpeech().speak` cancela cualquier
  lectura en curso (comportamiento existente del hook).
