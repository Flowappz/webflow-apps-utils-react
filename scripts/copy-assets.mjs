// Copies non-TS assets (CSS, fonts) from src/ to dist/, preserving structure.
// Skips assets belonging to files excluded from the build (demos, test helpers).
import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

const SRC = 'src';
const DIST = 'dist';
const ASSET_EXTENSIONS = ['.css', '.woff', '.woff2', '.ttf', '.otf'];
const EXCLUDED = ['GlobalProviderDemo.css', 'FormDemo.css', 'IconsShowcase.css', 'DiffMapperDemo.css', 'Example.css'];
const EXCLUDED_DIRS = [join('ui', 'components', 'layout', 'test-helpers')];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

let copied = 0;
for (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  if (!ASSET_EXTENSIONS.some((ext) => file.endsWith(ext))) continue;
  if (EXCLUDED.includes(rel.split(sep).pop())) continue;
  if (EXCLUDED_DIRS.some((dir) => rel.startsWith(dir + sep))) continue;

  const dest = join(DIST, rel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(file, dest);
  copied++;
}

console.log(`copy-assets: ${copied} asset files copied to ${DIST}/`);
