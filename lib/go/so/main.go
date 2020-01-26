package main

// #include <stdio.h>
// #include <stdlib.h>
import "C"
import "unsafe"

//export FreeString
func FreeString(str *C.char) {
	C.free(unsafe.Pointer(str))
}

func main() {}
