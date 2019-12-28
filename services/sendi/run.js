const os = require('os');
const path = require('path');
const exec = require('child_process').exec;

const platform = os.platform();

const bins = {
  linux: 'tusd',
  win32: 'tusd.exe',
  darwin: 'tusd-macos',
};

const binPath = path.join(__dirname, '.bin', bins[platform]);
const binProcess = exec(`${binPath} -s3-bucket=ra-storage -behind-proxy --hooks-http http://staging.reallco.com/api/callback/file`);

binProcess.stdout.pipe(process.stdout);
