/* eslint-disable no-console */
const axios = require('axios');
const fs = require('fs');
const os = require('os');

const mode = 0o750;
async function dwl(type) {
  fs.mkdirSync(`${__dirname}/../dist/build`, { mode });

  const exe = await axios.default({
    method: 'get',
    url: `https://bin.libraryofcode.org/${type}/amd64/gocrypt-cmd`,
    responseType: 'arraybuffer',
  });
  fs.writeFileSync(`${__dirname}/../dist/build/cmd`, exe.data, { mode });
  console.log(`--GoCrypt | Fetched GoCrypt [EXE/CMD] bindings from https://bin.libraryofcode.org/${type}/amd64/gocrypt-cmd`);
}

async function main() {
  if (os.arch() !== 'x64') throw new Error('GoCrypt only supports amd_x64 architectures.');
  if (os.platform() === 'win32') dwl('windows');
  else if (os.platform() === 'darwin') dwl('darwin');
  else if (os.platform() === 'linux') dwl('linux');
  else throw new Error('GoCrypt is only supported on Linux, Mac, and Windows operating systems.');
}

main();
