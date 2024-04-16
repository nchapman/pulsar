/* eslint-disable no-console */
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

function bumpPatchVersion(version) {
  const parts = version.split('.');
  const patch = parseInt(parts[2], 10) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}


try {
  const tauriJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src-tauri/tauri.conf.json'), 'utf8'));

  execSync(`git checkout release`);

  execSync(`git pull origin release`);

  execSync(`git merge main`);

  console.log('🟦 Current version', tauriJson.package.version);
  
  // Example usage:
  const currentVersion = tauriJson.package.version;
  const newVersion = bumpPatchVersion(currentVersion);
  // Update the version in tauriJson
  tauriJson.package.version = newVersion;
  
  // Write the updated tauriJson back to the file
  fs.writeFileSync(path.resolve(__dirname, '../src-tauri/tauri.conf.json'), JSON.stringify(tauriJson, null, 2));

  // log git status
  const status = execSync('git status').toString();

  if(status.includes('nothing to commit, working tree clean')) {
    console.log('🟥 Nothing to commit');
    return;
  }

  console.log(`🟢 Updated to ${tauriJson.package.version}`);

  execSync('git add .');
  execSync('git commit -m "Update version"');
  execSync(`git push origin release`);

  execSync(`git tag -a v${  newVersion  } -m "Release version ${  newVersion  }"`);
  
} catch (error) {
  console.error('Error:', error);
}
