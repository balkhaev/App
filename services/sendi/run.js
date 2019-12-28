const os = require('os');
const path = require('path');
const exec = require('child_process').exec;
const dotenv = require('dotenv');

dotenv.config();

const bins = {
  linux: 'tusd',
  win32: 'tusd.exe',
  darwin: 'tusd-macos',
};

const platform = os.platform();
const binPath = path.join(__dirname, '.bin', bins[platform]);
const binExec = `${binPath} -s3-bucket=${process.env.AWS_S3_BUCKET} -behind-proxy --hooks-http ${process.env.FILE_CALLBACK_ENDPOINT}`;
const binProcess = exec(binExec);

binProcess.stdout.pipe(process.stdout);
binProcess.stderr.pipe(process.stderr);
