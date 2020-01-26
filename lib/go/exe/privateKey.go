package main


import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"encoding/hex"
	"errors"
	"fmt"
)

func PrivateKeyInfo(pemEncodedKey string) {
	type Key struct {
		Type    string
		Curve   string
		Modulus int
	}
	bytes, err := hex.DecodeString(pemEncodedKey)
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not decode hexadecimal argument to string.")
	}
	block, _ := pem.Decode(bytes)
	if block == nil {
		HandleErrorFMT(errors.New("runtime error: invalid memory address or nil pointer dereference"), "[GO] Invalid private key provided.")
	}
	var keyInfo Key
	if block.Type == "EC PRIVATE KEY" {
		key, err := x509.ParseECPrivateKey(block.Bytes)
		if err != nil {
			HandleErrorFMT(err, "[GO] Could not parse EC private key.")
		}
		keyInfo.Curve = key.Curve.Params().Name
		keyInfo.Type = "EC"
	} else if block.Type == "RSA PRIVATE KEY" {
		key, err := x509.ParsePKCS1PrivateKey(block.Bytes)
		if err != nil {
			HandleErrorFMT(err, "[GO] Could not parse RSA private key.")
		}
		keyInfo.Modulus = key.Size()
		keyInfo.Type = "RSA"
	} else {
		HandleErrorFMT(errors.New("key block type unsupported"), "[GO] Key block type provided is unsupported.")
	}
	encoded, err := json.Marshal(keyInfo)
	if err != nil {
		HandleErrorFMT(err, "[GO] Unable to marshal JSON.")
	}
	fmt.Println(string(encoded))
}
