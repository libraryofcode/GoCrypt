package main

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"os"
	"strconv"
)

// RandomInt Command handler for generating a random integer.
func RandomInt() {
	if len(os.Args) < 3 {
		HandleErrorFMT(errors.New("expected arguments"), "[GO] Internal Error: Didn't receive enough arguments.")
	}
	max, err := strconv.Atoi(os.Args[2])
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not parse input integer.")
	}
	random, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	if err != nil {
		HandleErrorFMT(err, "[GO] Could generate integer.")
	}
	output := struct {
		Message int64
	}{
		Message: random.Int64(),
	}
	out, err := json.Marshal(&output)
	if err != nil {
		HandleErrorFMT(err, "[GO] Failed to marshal output data.")
	}
	fmt.Println(string(out))
}
