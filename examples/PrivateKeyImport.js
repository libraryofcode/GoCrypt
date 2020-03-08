/* eslint-disable no-console */
const gocrypt = require('../dist/index').default;

// Here we import a random EC private key.
const key = gocrypt.keys.importPrivateKey(`-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIDz/+A1lOWFKm/5hjxMthJVOfhp5NgKa0+UmSFsHqjwAoAoGCCqGSM49
AwEHoUQDQgAEXq4IzWL7XnSTk4XZGIidzU3RImwNTlEhYzrw4Vqys4tmS64u0UrQ
7gmH6qNP/TIPm3WcDY1FPsnC35SNS+dylg==
-----END EC PRIVATE KEY-----`);

// Then we log the key instance GoCrypt creates.
console.log(key);
