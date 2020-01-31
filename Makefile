# Usage
# make	# Go binaries, all archs are supported.
go_files_so := $(wildcard lib/go/so/*.go)
go_files_exe := $(wildcard lib/go/exe/*.go)

all: build_go

install:
	node ./bin/build.js

test:
	go test ${go_files_so}
	go test ${go_files_exe}

build_go:
	# SO
	@-mkdir build
	go test ${go_files_so}
	go build -v -o build/func.so -ldflags="-s -w" -buildmode=c-shared ${go_files_so}
	@chmod u+x build/func.so
	@file build/func.so
	# EXE
	go test ${go_files_exe}
	go build -v -o build/cmd -ldflags="-s -w" ${go_files_exe}
	@chmod u+x build/cmd
	@file build/cmd

build_go_windows_x64:
	@-mkdir build
	# EXE | Windows x64
	GOOS=windows go build -v -o build/windows-x64/cmd -ldflags="-s -w" ${go_files_exe}
	@chmod u+x build/windows-x64/cmd
	@file build/windows-x64/cmd

build_go_mac_x64:
	@-mkdir build
	# EXE | Mac x64
	GOOS=darwin go build -v -o build/mac-x64/cmd -ldflags="-s -w" ${go_files_exe}
	@chmod u+x build/mac-x64/cmd
	@file build/mac-x64/cmd

build_doc:
	npx typedoc --out doc lib --tsconfig lib/tsconfig.json --excludePrivate --name "GoCrypt" --hideGenerator --includeVersion

remove:
	-rm -rf dist/build

pre_push:
	cp -r lib/go dist/go

rm_push:
	-rm -rf dist/go

stage: remove rm_push pre_push
