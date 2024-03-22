const {execSync} = require('child_process');
// This script is meant to read the manifest from a gist, update it and the commit it back to the gist

// Remove the manifest folder if it exists
execSync('rm -rf manifest');

// Clone the repository
execSync('git clone https://gist.github.com/ospfranco/2399e4a47b54e82049dd23741e5d9582 manifest');

// Read the manifest
const manifest = require('./manifest/manifest.json');

// Update the manifest
manifest.version = '1.0.1';

// Write the manifest
require('fs').writeFileSync('./manifest/manifest.json', JSON.stringify(manifest, null, 2));

// change dir
process.chdir('./manifest');

// Commit the changes
execSync('git add .');

execSync('git commit -m "Update manifest"');

execSync('git push');

