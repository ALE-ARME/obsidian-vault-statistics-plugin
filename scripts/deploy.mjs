/**
 * Copies the built plugin into an Obsidian vault so it can be tested without
 * publishing a release.
 *
 * The destination is resolved from, in order:
 *   1. the PLUGIN_DIR environment variable
 *   2. the "pluginDir" field of deploy.local.json (untracked)
 *   3. .sandbox/.obsidian/plugins/obsidian-vault-statistics-plugin
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const FILES = ['main.js', 'manifest.json', 'styles.css'];
const DEFAULT_DIR = '.sandbox/.obsidian/plugins/obsidian-vault-statistics-plugin';

let target = process.env.PLUGIN_DIR;

if (!target && existsSync('deploy.local.json')) {
  target = JSON.parse(readFileSync('deploy.local.json', 'utf8')).pluginDir;
}

target = resolve(target || DEFAULT_DIR);

for (const file of FILES) {
  if (!existsSync(file)) {
    console.error(`Missing ${file}. Run "npm run build" first.`);
    process.exit(1);
  }
}

mkdirSync(target, { recursive: true });

for (const file of FILES) {
  copyFileSync(file, join(target, file));
}

console.log(`Deployed ${FILES.join(', ')} to ${target}`);
