const aws = require('aws-sdk');
const semver = require('semver')

// Read environment variables
const {
  APP_VERSION,
  MACOS_ARTIFACT_PATHS,
  NON_MACOS_ARTIFACT_PATHS,
  S3_ENDPOINT_URL,
  S3_BUCKET,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY
} = process.env;

const s3 = new aws.S3({
  endpoint: S3_ENDPOINT_URL,
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY
});

// eslint-disable-next-line consistent-return
const downloadManifest = async () => {
  const params = {
    Bucket: S3_BUCKET,
    Key: 'latest.json'
  };

  try {
    // Fetch the manifest file from S3
    const { Body } = await s3.getObject(params).promise();
    const manifest = JSON.parse(Body.toString());
    console.log('Manifest fetched successfully', manifest);
    return manifest;
  } catch (error) {
    console.error('Failed to fetch manifest.json from S3:', error);
    process.exit(1);
  }
};

// Update manifest version
const updateManifestVersion = (manifest) => {
  // eslint-disable-next-line no-param-reassign
  manifest.version = APP_VERSION;
  return manifest;
};

// Upload manifest.json to S3
const uploadManifest = async (manifest) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: 'latest.json',
    Body: JSON.stringify(manifest, null, 2),
    ContentType: 'application/json'
  };

  try {
    await s3.putObject(params).promise();
    console.log('Manifest uploaded successfully');
  } catch (error) {
    console.error('Failed to upload manifest.json to S3:', error);
    process.exit(1);
  }
};

// Main script
const main = async () => {
  // Download manifest.json from S3
  const manifest = await downloadManifest();

  // Compare semantic version and check if APP VERSION is greater than the manifest version
  if (semver.lt(APP_VERSION, manifest.version)) {
    console.error("App version is not greater than the manifest version. Update failed!")
    process.exit(1);
  }

  // // Update manifest version
  const updatedManifest = updateManifestVersion(manifest);

  console.log("Artifact paths")
  console.log(MACOS_ARTIFACT_PATHS)
  console.log(NON_MACOS_ARTIFACT_PATHS)
  console.log('app version')
  console.log(APP_VERSION)

  // // Upload updated manifest.json to S3
  // await uploadManifest(updatedManifest);

  // // Download artifacts from MACOS_ARTIFACT_PATHS
  // await downloadArtifacts(MACOS_ARTIFACT_PATHS.split(','));

  // // Download artifacts from NON_MACOS_ARTIFACT_PATHS
  // await downloadArtifacts(NON_MACOS_ARTIFACT_PATHS.split(','));

  // // Upload artifacts to S3
  // await uploadArtifacts([...MACOS_ARTIFACT_PATHS.split(','), ...NON_MACOS_ARTIFACT_PATHS.split(',')]);

  // console.log('Script completed successfully');
};

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});