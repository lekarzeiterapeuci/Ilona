// Podbija wersję czatu i dopisuje zmianę do CHANGES.md.
// Użycie:
//   npm run bump -- <patch|minor|major> "Opis zmiany"
// Przykład:
//   npm run bump -- minor "Nowe słowa kluczowe dla tematu L4"
// PATCH — poprawka bez zmiany zachowania; MINOR — nowa wiedza lub funkcja; MAJOR — zmiana zasad działania.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VERSION_FILE = `${ROOT}chat/version.js`;
const CHANGES_FILE = `${ROOT}CHANGES.md`;
const MARKER = '<!-- NEW ENTRIES BELOW -->';

const [part, ...descParts] = process.argv.slice(2);
const description = descParts.join(' ').trim();
if (!['patch', 'minor', 'major'].includes(part) || !description) {
  console.error('Użycie: npm run bump -- <patch|minor|major> "Opis zmiany"');
  process.exit(1);
}

const code = readFileSync(VERSION_FILE, 'utf8');
const current = code.match(/VERSION = '(\d+)\.(\d+)\.(\d+)'/);
if (!current) throw new Error('chat/version.js: nie znaleziono wersji');
let [major, minor, patch] = current.slice(1).map(Number);
if (part === 'major') [major, minor, patch] = [major + 1, 0, 0];
if (part === 'minor') [minor, patch] = [minor + 1, 0];
if (part === 'patch') patch += 1;
const next = `${major}.${minor}.${patch}`;
writeFileSync(VERSION_FILE, code.replace(/VERSION = '[^']+'/, `VERSION = '${next}'`));

const today = new Date().toISOString().slice(0, 10);
let changes = readFileSync(CHANGES_FILE, 'utf8');
const entry = `### ${next}\n- ${description}\n`;
const dayHeader = `## ${today}\n`;
const [head, rest = ''] = changes.split(MARKER);
const body = rest.replace(/^\s*/, '');
changes = body.startsWith(dayHeader)
  ? `${head}${MARKER}\n\n${dayHeader}\n${entry}\n${body.slice(dayHeader.length).replace(/^\s*/, '')}`
  : `${head}${MARKER}\n\n${dayHeader}\n${entry}\n${body}`;
writeFileSync(CHANGES_FILE, changes.replace(/\n{3,}/g, '\n\n'));
console.log(`Wersja: ${current.slice(1).join('.')} → ${next}. Zaktualizowano CHANGES.md. Sprawdź: npm run check`);
