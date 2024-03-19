// print the working directory
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

  // update the version

  console.log('Current version', tauriJson.package.version);
  
  // Example usage:
  const currentVersion = tauriJson.package.version;
  const newVersion = bumpPatchVersion(currentVersion);
  console.log(newVersion); // Output: 1.2.4
  // Update the version in tauriJson
  tauriJson.version = newVersion;
  
  // Write the updated tauriJson back to the file
  fs.writeFileSync(path.resolve(__dirname, '../src-tauri/tauri.conf.json'), JSON.stringify(tauriJson, null, 2));
  
  console.log('Version updated successfully!');

  // log git status
  const status = execSync('git status').toString();

  if(status.includes('nothing to commit, working tree clean')) {
    console.log('Nothing to commit 🟥');
    return;
  }
  
  execSync('git add .');
  execSync('git commit -m "Update version"');
  execSync('git push');
  
  // switch to the release branch
  execSync('git checkout release');
  
  // merge the changes
  execSync('git merge main');
  
  // push the changes
  execSync('git push');
  
  // switch back to the master branch
  execSync('git checkout main');
  
  
} catch (error) {
  console.error('Error:', error);
}
