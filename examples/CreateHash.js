/* eslint-disable no-console */
const gocrypt = require('../dist/index').default;

// This function calculates a SHA256 checksum from the string value of "hello, world!"
const hash = gocrypt.hash.createSHA256Checksum(Buffer.from('hello, world!'));

// We then convert the Buffer that the above return function returns into a string w/ hex
// encoding, and log it to the console.
console.log(hash.toString('hex'));
