# GoCrypt
*by Library of Code sp-us | Faculty Marshals*

`yarn add gocrypt` || `npm install gocrypt`

**This module fetches bindings and executables from the Library of Code sp-us [distribution center](https://bin.libraryofcode.org) upon installation. The script will automatically determine your operating system and install related bindings.**

GoCrypt is a package written in TypeScript for advanced crytography functions and utilities using
native Node.js crypto functions & via Go bindings.
GoCrypt's mission is to offer all the crypto-related functions and APIs any Node.js developer will need, we understand the difficulty of being able to do x509-related stuff natively. There's really no good libraries out there for making certificates or CSRs for example *(@ every "x509" library out there that just spawns openssl)*, we want to change that.

## Installation Requirements

- Node 12.4.0 or higher is required for stable usage.
- AMD_x64 CPU architecture.
- Windows, Mac, or Linux operating systems.

## Gotcha(s)

GoCrypt is using ES6, and TypeScript is gonna spit out some whack stuff when it compiles. If you're not using ES6 when you import GoCrypt all of the function libaries are going to be under a property called `default`. So if you're using require, then require GoCrypt like this:
```js
const gocrypt = require('gocrypt').default;
```

## Documentation
You can view documentation [here](https://gocrypt.libraryofcode.org).

## Change Log
You can view the Change Log [here](https://github.com/LibraryofCode/GoCrypt/blob/master/CHANGELOG.md).

## Support Resources
You can contact Library of Code through the methods listed below, if you have an issue with the repository, feel free to join the Discord server to ask for help or open an issue on our [repository](https://github.com/LibraryofCode/GoCrypt).
- [Discord Server](https://discord.gg/F4ztpQh)
- [Support Desk](https://support.libraryofcode.org/)
- *our contact email address is at the bottom of this file*

This module includes TypeScript declaration files.


[Repository](https://github.com/LibraryofCode/GoCrypt) | [NPM](https://npmjs.com/package/gocrypt) | [Support](https://support.libraryofcode.org) 

**Library of Code sp-us, Faculty Marshals** <marshals@staff.libraryofcode.org>
