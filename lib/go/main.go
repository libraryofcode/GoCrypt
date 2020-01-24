package main

// #include <stdio.h>
// #include <stdlib.h>
import "C"
import "unsafe"

import (
	"crypto/rand"
	"encoding/json"
	"math/big"
)

//export RandomInt
func RandomInt(max int) *C.char {
	type output struct {
		Num int64
		Err string
	}
	random, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	var outError string
	if err != nil {
		random = big.NewInt(-1)
		outError = err.Error()
	}
	out := output{
		Num: random.Int64(),
		Err: outError,
	}
	data, err := json.Marshal(out)
	if err != nil {
		panic(err)
	}
	return C.CString(string(data))
}

//export FreeString
func FreeString(str *C.char) {
	C.free(unsafe.Pointer(str))
}

func main() {}
