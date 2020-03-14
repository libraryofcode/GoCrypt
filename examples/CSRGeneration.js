/* eslint-disable no-console */
const gocrypt = require('../dist/index').default;

// In "PrivateKeyImport.js", we imported a private key into GoCrypt. We're going to use the
// same private key in that example here to generate our CSR with.

let key = new gocrypt.PrivateKey();
key = key.import(`-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIDz/+A1lOWFKm/5hjxMthJVOfhp5NgKa0+UmSFsHqjwAoAoGCCqGSM49
AwEHoUQDQgAEXq4IzWL7XnSTk4XZGIidzU3RImwNTlEhYzrw4Vqys4tmS64u0UrQ
7gmH6qNP/TIPm3WcDY1FPsnC35SNS+dylg==
-----END EC PRIVATE KEY-----`);

// We then create ths CSR here.
let csr = new gocrypt.CSR();
csr = csr.create(key, { subject: { commonName: 'google.com', organization: ['Google, LLC'] } });

// We then export the CSR in PEM format, and log it to the console.
console.log(csr.export().toString());
