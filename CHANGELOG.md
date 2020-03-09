# [1.8.0](https://github.com/LibraryofCode/GoCrypt/compare/v1.7.0...v1.8.0) (2020-03-09)


### Features

* **lib/classes/Hash.ts:** Add hash [static] class, used for making SHA256/SHA512 checksums ([3c754f3](https://github.com/LibraryofCode/GoCrypt/commit/3c754f3cf99ef53d481e5d4c6e370ff79886708d))

# [1.7.0](https://github.com/LibraryofCode/GoCrypt/compare/v1.6.0...v1.7.0) (2020-03-08)


### Bug Fixes

* **lib/classes/Certificates.ts:** Fix issue with Go binding exec for importCertificate(); ([ffa3e70](https://github.com/LibraryofCode/GoCrypt/commit/ffa3e7072581a563443d8b410d824fc197289c85))
* **lib/go/exec/*:** Fix error handling issues in Go bindings ([913235f](https://github.com/LibraryofCode/GoCrypt/commit/913235f8703cdc39d18835c14b5ddbba20c47989))
* **lib/index.ts:** Remove redudant functions ([be5c261](https://github.com/LibraryofCode/GoCrypt/commit/be5c2617693fc3350c963a149f5c525f14e5bd4b))
* **lib/structs/Certificate.ts:** Fix issue with null properties, general cleanup of constructor ([3f48767](https://github.com/LibraryofCode/GoCrypt/commit/3f4876705bdbe4ff99c424f041112a227cc8bd51))
* **lib/structs/CSR.ts:** Fix issue with faulty CSR export ([d251289](https://github.com/LibraryofCode/GoCrypt/commit/d251289b5d3d50f5e782f9d0d00bc298432c5330))


### Features

* **lib/classes/Certificate.ts:** Add Certificate importing function ([da8d942](https://github.com/LibraryofCode/GoCrypt/commit/da8d94203dabb8ff7b67fa2f09441db332559433))
* **lib/structs/Certificate.ts:** certificate struct ([966c8be](https://github.com/LibraryofCode/GoCrypt/commit/966c8be489cabce4470fe61ff2c7b7d5808799ab))
* **lib/structs/Certificate.ts:** certificate struct ([c846f84](https://github.com/LibraryofCode/GoCrypt/commit/c846f84d2a60bcdecb906acccc3692913798d194))
* **lib/structs/Certificate.ts:** export func for certificates ([2ae1266](https://github.com/LibraryofCode/GoCrypt/commit/2ae1266ac86348fc771350454effc0e54a553ee7))
* **lib/structs/Collection.ts:** Implement a Collection struct, replace Map inheritance in Keys.ts and Certificates.ts ([a841d5b](https://github.com/LibraryofCode/GoCrypt/commit/a841d5b37373a6cfb864a0373571f49d6b2c59ed))

# [1.6.0](https://github.com/LibraryofCode/GoCrypt/compare/v1.5.0...v1.6.0) (2020-03-02)


### Bug Fixes

* **lib/index.ts:** Remove OS/Go installation checks in module load ([1f038f1](https://github.com/LibraryofCode/GoCrypt/commit/1f038f1c0de2cc31d938aa285cfeb7beae0ab15e))


### Features

* **lib/classes/Util.ts:** Random number generator function, no longer uses SO-based functions; now available on win/mac ([4182500](https://github.com/LibraryofCode/GoCrypt/commit/4182500cba85d94b55a0e243066226688416869b))

# [1.5.0](https://github.com/LibraryofCode/GoCrypt/compare/v1.4.0...v1.5.0) (2020-02-29)


### Features

* **lib/go/exe/util.go:** Add random integer generation for Windows & Mac w/o shared libraries ([cafd8d6](https://github.com/LibraryofCode/GoCrypt/commit/cafd8d668aa19ec21e56546b48d058f9c032226c))

# [1.4.0](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.3.5...v1.4.0) (2020-02-24)


### Bug Fixes

* **go/exe/main.go:** remove random print statement on errors ([02ee713](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/02ee7131174507485afd6ce547a3d66cab9b7303))


### Features

* **structs/Certificate.ts:** public declarations for subject/issuer in cert structc ([f7c3e74](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/f7c3e7452d94cc1f6a47465544e778d9a8be2132))

## [1.3.5](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.3.4...v1.3.5) (2020-02-17)


### Bug Fixes

* **classes/Util.ts:** randomInt() should check for Linux platform ([5ba62c8](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/5ba62c87b84809baefdc0a56498323ea1a0deab2))

## [1.3.4](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.3.3...v1.3.4) (2020-01-31)


### Bug Fixes

* ci & build script ([7828afd](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/7828afd5fdbf6170bf51a430b0074111882bde1d))
* Fixes an issue with the build script, not creating build dir ([f613e63](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/f613e6337498e2a9bfa5d9a43b8328e75ab5e6f7))
* Fixes an issue with the build script, not creating build dir ([617163d](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/617163dee42c8e8f77d0128f844ac799bb62e430))
* Fixes for README typos and CI ([2ed0c24](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/2ed0c24a1b795532605abfb391e2480353c71dd9))
* fixes issue with build script ([39a6183](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/39a61833f3576f9d5da11eec800af88f4fa3ab94))

## [1.3.3](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.3.2...v1.3.3) (2020-01-31)


### Bug Fixes

* fixes issue with build script ([64c6f6c](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/64c6f6cda622ec8f347ba9e9f18139702293cd62))

## [1.3.2](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.3.1...v1.3.2) (2020-01-31)


### Bug Fixes

* Fixes for README typos and CI ([f9af9bb](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/f9af9bbd1d48be68e2952039600a4bca4d0f9632))

## [1.3.1](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.3.0...v1.3.1) (2020-01-31)


### Bug Fixes

* ci & build script ([57c526c](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/57c526c4dc4e0768ecb0cfcd74853bfdcf9da9f8))

# [1.3.0](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.2.6...v1.3.0) (2020-01-31)


### Features

* Build script ([c81f3c5](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/c81f3c5f51490339c5b417d928a39d6e3ee04f1a))
* Windows & Mac x64 support ([e2c5c80](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/e2c5c80c46f17d03ac7a800fa529547ac7fcabd5))
* **x509:** Add support for creation of Certificate Signing Requests ([49e5d62](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/49e5d629728b649103b1ab067cc0bd27f2831a3d))

## [1.2.6](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.2.5...v1.2.6) (2020-01-27)


### Bug Fixes

* **pkg:** more info to package.json ([730602b](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/730602b2dcaf809f9bac1c75f3d14e55448664e0))

## [1.2.5](https://gitlab.libraryofcode.org/engineering/gocrypt/compare/v1.2.4...v1.2.5) (2020-01-27)


### Bug Fixes

* **pkg:** add changelog step ([fe145fb](https://gitlab.libraryofcode.org/engineering/gocrypt/commit/fe145fbb40847d374d479b9ca0d349dd50e6faa6))
