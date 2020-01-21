package main

import "C"

import (
	"crypto/rand"
	"math/big"
)

//export RandomInt
func RandomInt(max int) int {
	random, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	if err != nil {
		panic(err)
	}
	return int(random.Int64())
}

func main() {}
