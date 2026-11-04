/**
 * Keeps manifest.json and versions.json in sync with package.json when the
 * version is bumped with `npm version <major|minor|patch>`.
 *
 * npm runs this file through the "version" lifecycle script and exposes the
 * new version in the npm_package_version environment variable.
 */
import { readFileSync, writeFileSync } from 'fs';

const targetVersion = process.env.npm_package_version;

if (!targetVersion) {
  console.error('npm_package_version is not set. Run this script through npm version.');
  process.exit(1);
}

// Keep manifest.json in sync (minAppVersion is left untouched).
const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
manifest.version = targetVersion;
writeFileSync('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

// Record which minAppVersion the release needs.
const versions = JSON.parse(readFileSync('versions.json', 'utf8'));
versions[targetVersion] = manifest.minAppVersion;

// Sort newest version first so the file stays readable.
const sorted = Object.fromEntries(
  Object.entries(versions).sort((a, b) => {
    const pa = a[0].split('.').map(Number);
    const pb = b[0].split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const diff = (pb[i] || 0) - (pa[i] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  }),
);
writeFileSync('versions.json', `${JSON.stringify(sorted, null, 2)}\n`);

console.log(`Updated manifest.json and versions.json to ${targetVersion}`);
