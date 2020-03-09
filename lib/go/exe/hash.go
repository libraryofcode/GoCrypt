package main

import (
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
)

// CreateSHA256Hash Command function for creating a SHA256 checksum hash
func CreateSHA256Hash() {
	var encodedData string
	fmt.Scanln(&encodedData)
	bytes, err := hex.DecodeString(encodedData)
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not decode hexadecimal argument to string.")
	}
	sum := sha256.Sum256(bytes)
	hex := hex.EncodeToString(sum[:])
	output := struct {
		Message string
	}{
		Message: hex,
	}
	out, err := json.Marshal(&output)
	if err != nil {
		HandleErrorFMT(err, "[GO] Failed to marshal output data.")
	}
	fmt.Println(string(out))
}

// CreateSHA512Hash Command function for creating a SHA512 checksum hash
func CreateSHA512Hash() {
	var encodedData string
	fmt.Scanln(&encodedData)
	bytes, err := hex.DecodeString(encodedData)
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not decode hexadecimal argument to string.")
	}
	sum := sha512.Sum512(bytes)
	hex := hex.EncodeToString(sum[:])
	output := struct {
		Message string
	}{
		Message: hex,
	}
	out, err := json.Marshal(&output)
	if err != nil {
		HandleErrorFMT(err, "[GO] Failed to marshal output data.")
	}
	fmt.Println(string(out))
}
