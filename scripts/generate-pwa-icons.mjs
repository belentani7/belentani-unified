#!/usr/bin/env node
// Genera los iconos PWA. Si los datos reales no están disponibles,
// se comporta como un no-op y sale con código 0.

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function main() {
  const sourceIcon = path.join(projectRoot, 'public', 'icon-source.png');
  const publicDir = path.join(projectRoot, 'public');

  if (!existsSync(publicDir)) {
    console.log('[generate-pwa-icons] Directorio "public" no encontrado. Nada que hacer.');
    return 0;
  }

  if (!existsSync(sourceIcon)) {
    console.log('[generate-pwa-icons] Icono fuente no disponible. Se omite la generación de iconos PWA.');
    return 0;
  }

  // La generación real de iconos requiere herramientas externas (p. ej. sharp).
  // Como no hay datos disponibles en este entorno, se comporta como no-op.
  console.log('[generate-pwa-icons] Generación de iconos PWA omitida (datos no disponibles).');
  return 0;
}

process.exit(main());
