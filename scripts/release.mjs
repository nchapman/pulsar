/* eslint-disable no-console */
import { execSync } from 'child_process';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the file path from the URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function bumpPatchVersion(version) {
  const parts = version.split('.');
  const patch = parseInt(parts[2], 10) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}

const tauriJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src-tauri/tauri.conf.json'), 'utf8')
);

const currentVersion = tauriJson.package.version;
const newVersion = bumpPatchVersion(currentVersion);
// Update the version in tauriJson
tauriJson.package.version = newVersion;

// Write the updated tauriJson back to the file
fs.writeFileSync(
  path.resolve(__dirname, '../src-tauri/tauri.conf.json'),
  JSON.stringify(tauriJson, null, 2)
);

console.log(`🟢 Bumped ${currentVersion} → ${newVersion}`);

execSync('git add .', { stdio: 'inherit' });
execSync(`git commit --no-verify -m "Release ${newVersion}"`, { stdio: 'inherit' });
execSync(`git push`, { stdio: 'inherit' });

await sleep(2000);

execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`, { stdio: 'inherit' });
execSync(`git push --tags`, { stdio: 'inherit' });

