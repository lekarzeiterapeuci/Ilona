// Strażnik wersji czatu. Uruchom: npm run check
// Kończy się błędem (kod 1), gdy chat/version.js ma niepoprawną wersję
// albo CHANGES.md nie ma wpisu "### <wersja>" dla bieżącej wersji.
import { readFileSync } from 'node:fs';
import { VERSION } from '../chat/version.js';

const changes = readFileSync(new URL('../CHANGES.md', import.meta.url), 'utf8');
const errors = [];
if (!/^\d+\.\d+\.\d+$/.test(VERSION)) errors.push(`chat/version.js: niepoprawna wersja "${VERSION}"`);
if (!changes.includes(`### ${VERSION}\n`)) errors.push(`CHANGES.md: brak wpisu "### ${VERSION}" — użyj: npm run bump -- <patch|minor|major> "Opis"`);
if (errors.length) {
  console.error('Kontrola wersji — BŁĘDY:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`Kontrola wersji OK: Ilona ${VERSION}`);
