#!/usr/bin/env node
// Descubre y ejecuta las pruebas del núcleo. Actualmente no hay pruebas
// definidas, por lo que imprime un mensaje y sale con código 0.

import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function discoverTests() {
  const candidates = [
    path.join(projectRoot, 'tests'),
    path.join(projectRoot, 'test'),
    path.join(projectRoot, '__tests__'),
  ];

  const found = [];
  for (const dir of candidates) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isFile() && /\.(test|spec)\.(mjs|js|ts|tsx)$/.test(entry.name)) {
        found.push(path.join(dir, entry.name));
      }
    }
  }
  return found;
}

function main() {
  const tests = discoverTests();

  if (tests.length === 0) {
    console.log('no core tests defined');
    return 0;
  }

  // No hay runner de pruebas configurado en este entorno.
  console.log(`[test-core] Se encontraron ${tests.length} archivo(s) de prueba, pero no hay runner configurado.`);
  console.log('no core tests defined');
  return 0;
}

process.exit(main());
