# Usage
# make	# Go binaries, all archs are supported.
go_files := $(wildcard dist/go/*.go)

all: build_go

build_go:
	@-mkdir dist/build
	go test ${go_files}
	go build -v -o dist/build/func.so -ldflags="-s -w" -buildmode=c-shared ${go_files}
	@chmod u+x dist/build/func.so
	@file dist/build/func.so

remove:
	-rm -rf dist/build

pre_push:
	cp -r lib/go dist/go

rm_push:
	-rm -rf dist/go
