package main

import (
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
)

// CSR Function command for generating a CSR.
func CSR() {
	type CertificateSigningRequestData struct {
		Subject struct {
			Country, Organization, OrganizationalUnit, StreetAddress, PostalCode []string
			CommonName                                                           string
		}
		San struct {
			DNSNames, EmailAddresses, IPAddresses []string
		}
		Key string
	}
	var data string
	var csr CertificateSigningRequestData
	fmt.Scanln(&data)
	bytes, err := hex.DecodeString(data)
	json.Unmarshal(bytes, &csr)
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not decode hexadecimal argument to string.")
	}
	block, _ := pem.Decode([]byte(csr.Key))
	var decKey interface{}
	if block == nil {
		HandleErrorFMT(errors.New("runtime error: invalid memory address or nil pointer dereference"), "[GO] Invalid private key provided.")
	}
	if block.Type == "EC PRIVATE KEY" {
		key, err := x509.ParseECPrivateKey(block.Bytes)
		if err != nil {
			HandleErrorFMT(err, "[GO] Could not parse EC private key.")
		}
		decKey = key
	} else if block.Type == "RSA PRIVATE KEY" {
		key, err := x509.ParsePKCS1PrivateKey(block.Bytes)
		if err != nil {
			HandleErrorFMT(err, "[GO] Could not parse RSA private key.")
		}
		decKey = key
	} else {
		HandleErrorFMT(errors.New("key block type unsupported"), "[GO] Key block type provided is unsupported.")
	}
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not decode hexadecimal argument to string.")
	}
	csrTemplate := &x509.CertificateRequest{
		Subject: pkix.Name{
			Country:            csr.Subject.Country,
			Organization:       csr.Subject.Organization,
			OrganizationalUnit: csr.Subject.OrganizationalUnit,
			StreetAddress:      csr.Subject.StreetAddress,
			PostalCode:         csr.Subject.PostalCode,
			CommonName:         csr.Subject.CommonName,
		},
		DNSNames:       csr.San.DNSNames,
		EmailAddresses: csr.San.EmailAddresses,
	}
	generatedCSR, err := x509.CreateCertificateRequest(rand.Reader, csrTemplate, decKey)
	if err != nil {
		HandleErrorFMT(err, "[GO] Failed to generate CSR.")
	}
	csrPemEncoded := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE REQUEST", Bytes: generatedCSR})
	type output struct {
		Req string
	}
	jsonOutput, _ := json.Marshal(&output{Req: string(csrPemEncoded)})
	fmt.Println(string(jsonOutput))
}
