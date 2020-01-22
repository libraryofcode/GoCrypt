# GoCrypt
*by Library of Code sp-us | Faculty Marshals*

`yarn add gocrypt` || `npm install gocrypt`

**Module will only build Go binaries on Linux distros.**

GoCrypt is a package written in TypeScript for advanced crytography functions and utilities using
native Node.js crypto functions & via Go bindings.

***WARNING:*** **This module is __not__ stable at the moment, the version will be bumped to v2.0.0 when it is stable for use.**

## Installation Requirements

- Go 1.13+ is required for installation.
- Makefile is required for installation, (i.e. the make command that's only available on Linux, which is why this module is preferred to be used for Linux only.)

## Gotcha(s)

GoCrypt is using ES6, and TypeScript is gonna spit out some whack stuff when it compiles. If you're not using ES6 when you import GoCrypt all of the function libaries are going to be under a property called `default`. So if you're using require, then require GoCrypt like this:
```js
const gocrypt = require('gocrypt').default;
```


This module includes TypeScript declaration files.


**Library of Code sp-us, Faculty Marshals** <marshals@staff.libraryofcode.org>
