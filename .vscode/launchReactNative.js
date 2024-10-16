const path = require('path');
const os = require('os');
const child_process = require('child_process');

// Resolve workspace root
const workspaceRoot =
  process.env.REACT_NATIVE_PROJECT_ROOT || path.resolve(__dirname, '..');

// Determine the platform (iOS or Android)
const isMac = os.platform() === 'darwin';

// Function to execute a command
function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const spawnedProcess = child_process.spawn(command, args, options);

    spawnedProcess.stdout.on('data', data => {
    });

    spawnedProcess.stderr.on('data', data => {
      console.error(data.toString());
    });

    spawnedProcess.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Command failed with exit code ${code}`);
      }
    });
  });
}

// Launch React Native app
async function launchReactNative() {
  try {

    // Set default platform to iOS
    const platform = isMac ? 'ios' : 'android';

    // Check if additional run arguments exist
    const runArgs = process.argv.slice(2);

    // Construct the command to run
    const command = 'npx';
    const args = ['react-native', 'run-' + platform].concat(runArgs);

    // Run the React Native command
    await runCommand(command, args, {cwd: workspaceRoot});

  } catch (error) {
    console.error('Failed to launch React Native app:', error);
  }
}

// Execute the function
launchReactNative();
