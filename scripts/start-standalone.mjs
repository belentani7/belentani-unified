#!/usr/bin/env node
// Arranca el servidor standalone de Next.js si existe.
// Si no existe, imprime un error y sale con código 1.

import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function main() {
  const serverPath = path.join(projectRoot, '.next', 'standalone', 'server.js');

  if (!existsSync(serverPath)) {
    console.error('[start-standalone] No se encontró .next/standalone/server.js. Ejecuta "npm run build" primero.');
    return 1;
  }

  const child = spawn(process.execPath, [serverPath], {
    stdio: 'inherit',
    cwd: projectRoot,
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('[start-standalone] Error al arrancar el servidor:', err);
    process.exit(1);
  });

  return null;
}

const result = main();
if (typeof result === 'number') {
  process.exit(result);
}
