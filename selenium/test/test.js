const os = require('os');
const path = require('path');
const { expect } = require('chai');
const { spawn, spawnSync } = require('child_process');
const { Builder, By, Capabilities, logging } = require('selenium-webdriver');

// create the path to the expected application binary
const application = path.resolve(__dirname, '..', '..', 'src-tauri', 'target', 'release', 'pulsar');

// keep track of the webdriver instance we create
let driver;

// keep track of the tauri-driver process we start
let tauriDriver;

before(async function () {
  // set timeout to 2 minutes to allow the program to build if it needs to
  this.timeout(120000);

  console.log('mark0');

  // process.chdir('../src-tauri')
  // // ensure the program has been built
  // const cargoBuildRes = spawnSync('cargo', ['build', '--release'], {
  //   stdio: 'inherit'
  // });
  // if(cargoBuildRes.status !== 0){
  //   console.log("failed to cargo build");
  //   console.log(cargoBuildRes.stderr.toString());
  // }
  // console.log('mark1', cargoBuildRes.status);
  // start tauri-driver
  tauriDriver = spawn(path.resolve(os.homedir(), '.cargo', 'bin', 'tauri-driver'), [], {
    stdio: 'inherit',
  });
  console.log('mark2');

  let prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.SERVER, logging.Level.ALL);
  prefs.setLevel(logging.Type.SERVER, logging.Level.ALL);
prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);

  const capabilities = new Capabilities();
  capabilities.set('tauri:options', { application });
  capabilities.setBrowserName('wry');
  capabilities.setLoggingPrefs(prefs);
  // capabilities.setLevel(logging.Level.ALL);

  console.log("capabilities created... starting server")

  
  // start the webdriver client
  driver = await new Builder()
  .setLoggingPrefs(prefs)
    .withCapabilities(capabilities)
    .usingServer('http://127.0.0.1:4444/')
    .build();

  console.log('tests ready to start!!');
});

after(async () => {
  if(driver) {
    // stop the webdriver session
    await driver.quit();
  
    // kill the tauri-driver process
    tauriDriver.kill();
  }
});

describe('Hello Tauri', () => {
  it('should be cordial', async () => {
    const text = await driver.findElement(By.css('body > h1')).getText();
    expect(text).to.match(/^[hH]ello/);
  });
});
