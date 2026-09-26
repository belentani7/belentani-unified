// ============================================================
// Manos Abiertas — Felicitaciones rotativas (gamificación)
// Frases en español y portugués (BR). Rotación determinista
// según el número de lecciones completadas.
// ============================================================

export const CONGRATS_ES = [
  '¡Buen trabajo! Has completado esta lección. 🌟',
  '¡Excelente! Cada lección te acerca más a tu meta. 💪',
  '¡Sigue así! Estás aprendiendo cada día más. 🎉',
] as const;

export const CONGRATS_PT_BR = [
  'Bom trabalho! Você completou esta lição. 🌟',
  'Excelente! Cada lição te deixa mais perto da sua meta. 💪',
  'Continue assim! Você está aprendendo mais a cada dia. 🎉',
] as const;

export const CONGRATS_COURSE_ES =
  '¡Felicidades! Completaste el curso completo. ¡Qué logro tan grande! 🏆';

export const CONGRATS_COURSE_PT_BR =
  'Parabéns! Você completou o curso inteiro. Que conquista incrível! 🏆';

/**
 * Devuelve la frase de felicitación según idioma y progreso.
 * Rotación determinista: las frases se alternan sin depender del azar.
 */
export function getCongratsMessage(lang: string, completedCount: number): string {
  const pool = lang === 'pt-BR' ? CONGRATS_PT_BR : CONGRATS_ES;
  const index = Math.max(0, completedCount - 1) % pool.length;
  return pool[index];
}

export function getCongratsCourseMessage(lang: string): string {
  return lang === 'pt-BR' ? CONGRATS_COURSE_PT_BR : CONGRATS_COURSE_ES;
}
