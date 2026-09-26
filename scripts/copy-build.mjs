#!/usr/bin/env node
// Copia .next/static y public dentro de .next/standalone si existen.
// Si no existen, imprime un mensaje y sale con código 0.

import { existsSync, cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.log(`[copy-build] Origen no encontrado: ${path.relative(projectRoot, src)}`);
    return false;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log(`[copy-build] Copiado ${path.relative(projectRoot, src)} -> ${path.relative(projectRoot, dest)}`);
  return true;
}

function main() {
  const standaloneDir = path.join(projectRoot, '.next', 'standalone');

  if (!existsSync(standaloneDir)) {
    console.log('[copy-build] Directorio .next/standalone no encontrado. Nada que copiar.');
    return 0;
  }

  const staticSrc = path.join(projectRoot, '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');
  copyDir(staticSrc, staticDest);

  const publicSrc = path.join(projectRoot, 'public');
  const publicDest = path.join(standaloneDir, 'public');
  copyDir(publicSrc, publicDest);

  return 0;
}

process.exit(main());
