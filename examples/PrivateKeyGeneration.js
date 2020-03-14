/* eslint-disable no-console */
const gocrypt = require('../dist/index').default;

// We're creating the key here, this is an EC key with the Prime256V1 curve.
let key = new gocrypt.PrivateKey();
key = key.create('ec', { namedCurve: 'prime256v1' });

// We then export the key in PEM format. We're selecting "sec1" here because it's the primary
// export type for EC keys.
const pem = key.export('sec1', 'pem');

// Finally, we log the key to the console.
console.log(pem);
