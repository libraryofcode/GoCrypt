package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// HandleErrorFMT Handles an error.
func HandleErrorFMT(err error, message string) {
	type output struct {
		Err     string
		Message string
	}
	var i output
	i.Err = err.Error()
	i.Message = message
	encoded, errJ := json.Marshal(i)
	if errJ != nil {
		panic(errJ)
	}
	fmt.Println(string(encoded))
	os.Exit(1)
}

func main() {
	PrivateKeyInfo(os.Args[2])
}
