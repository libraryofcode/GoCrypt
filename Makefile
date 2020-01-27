# Usage
# make	# Go binaries, all archs are supported.
go_files_so := $(wildcard dist/go/so/*.go)
go_files_exe := $(wildcard dist/go/exe/*.go)

all: build_go

test:
	go test ${go_files_so}
	go test ${go_files_exe}

build_go:
	# SO
	@-mkdir dist/build
	go test ${go_files_so}
	go build -v -o dist/build/func.so -ldflags="-s -w" -buildmode=c-shared ${go_files_so}
	@chmod u+x dist/build/func.so
	@file dist/build/func.so
	# EXE
	go test ${go_files_exe}
	go build -v -o dist/build/cmd -ldflags="-s -w" ${go_files_exe}
	@chmod u+x dist/build/cmd
	@file dist/build/cmd

remove:
	-rm -rf dist/build

pre_push:
	cp -r lib/go dist/go

rm_push:
	-rm -rf dist/go

stage: remove rm_push pre_push
