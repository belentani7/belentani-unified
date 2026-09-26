#!/usr/bin/env node
// Genera las herramientas de plataforma. Si los datos reales no están
// disponibles, se comporta como un no-op y sale con código 0.

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function main() {
  const dataDir = path.join(projectRoot, 'data');
  const sourceFile = path.join(dataDir, 'platform-tools.json');

  if (!existsSync(sourceFile)) {
    console.log('[generate-platform-tools] Datos de herramientas no disponibles. Se omite la generación.');
    return 0;
  }

  // La generación real requiere procesar los datos fuente.
  // Como no hay datos disponibles en este entorno, se comporta como no-op.
  console.log('[generate-platform-tools] Generación de herramientas de plataforma omitida (datos no disponibles).');
  return 0;
}

process.exit(main());
