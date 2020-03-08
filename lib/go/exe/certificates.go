package main

import (
	"fmt"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"errors"
	"crypto/x509"
	"time"
)

// CertificateInfo Command function for certificate information.
func CertificateInfo() {
	type Certificate struct {
		Subject struct {
			Country, Organization, OrganizationalUnit, StreetAddress, PostalCode []string
			CommonName string
		}
		San struct {
			DNSNames, EmailAddresses, IPAddresses, URIs []string
		}
		Issuer struct {
			Country, Organization, OrganizationalUnit, StreetAddress, PostalCode []string
			CommonName string
		}
		AuthorityInformationAccess struct {
			OCSPServer, IssuingCertificateURL []string
		}
		IsCA bool
		KeyUsage, ExtendedKeyUsage []string
		SerialNumber, PublicKeyAlgorithm, SignatureAlgorithm string
		Version int
		NotBefore, NotAfter time.Time
	}

	var encodedCertificate string
	fmt.Scanln(&encodedCertificate)
	bytes, err := hex.DecodeString(encodedCertificate)
	if err != nil {
		HandleErrorFMT(err, "[GO] Could not decode hexadecimal argument to string.")
	}
	block, _ := pem.Decode(bytes)
	if block == nil {
		HandleErrorFMT(errors.New("runtime error: invalid memory address or nil pointer dereference"), "[GO] Invalid private key provided.")
	}
	var certificateInfo Certificate
	if block.Type == "CERTIFICATE" {
		cert, err := x509.ParseCertificate(block.Bytes)
		if err != nil {
			HandleErrorFMT(err, "[GO] Could not parse x509 certificate.")
		}
		certificateInfo.Subject.CommonName = cert.Subject.CommonName
		certificateInfo.Subject.Country = cert.Subject.Country
		certificateInfo.Subject.Organization = cert.Subject.Organization
		certificateInfo.Subject.OrganizationalUnit = cert.Subject.OrganizationalUnit
		certificateInfo.Subject.PostalCode = cert.Subject.PostalCode
		certificateInfo.Subject.StreetAddress = cert.Subject.StreetAddress
		certificateInfo.Issuer.CommonName = cert.Issuer.CommonName
		certificateInfo.Issuer.Country = cert.Issuer.Country
		certificateInfo.Issuer.Organization = cert.Issuer.Organization
		certificateInfo.Issuer.OrganizationalUnit = cert.Issuer.OrganizationalUnit
		certificateInfo.Issuer.PostalCode = cert.Issuer.PostalCode
		certificateInfo.Issuer.StreetAddress = cert.Issuer.StreetAddress
		certificateInfo.San.EmailAddresses = cert.EmailAddresses
		certificateInfo.San.DNSNames = cert.DNSNames
		for _, val := range cert.IPAddresses {
			certificateInfo.San.IPAddresses = append(certificateInfo.San.IPAddresses, val.String())
		}
		for _, val := range cert.URIs {
			certificateInfo.San.URIs = append(certificateInfo.San.URIs, val.String())
		}
		certificateInfo.IsCA = cert.IsCA
		certificateInfo.AuthorityInformationAccess.OCSPServer = cert.OCSPServer
		certificateInfo.AuthorityInformationAccess.IssuingCertificateURL = cert.IssuingCertificateURL
		for _, val := range cert.ExtKeyUsage {
			switch val {
			case 0:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "Any")
				break
			case 1:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "ServerAuth")
				break
			case 2:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "ClientAuth")
				break
			case 3:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "CodeSigning")
				break
			case 4:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "EmailProtection")
				break
			case 8:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "TimeStamping")
				break
			case 9:
				certificateInfo.ExtendedKeyUsage = append(certificateInfo.ExtendedKeyUsage, "OCSPSigning")
			default:
				break
			}
		}
		certificateInfo.KeyUsage = CheckCertificateKeyUsages(int(cert.KeyUsage))
		certificateInfo.PublicKeyAlgorithm = cert.PublicKeyAlgorithm.String()
		certificateInfo.SignatureAlgorithm = cert.SignatureAlgorithm.String()
		certificateInfo.Version = cert.Version
		certificateInfo.SerialNumber = cert.SerialNumber.String()
		certificateInfo.NotBefore = cert.NotBefore
		certificateInfo.NotAfter = cert.NotAfter

		data, err := json.Marshal(certificateInfo)
		if err != nil {
			HandleErrorFMT(err, "[GO] Could not marshal output data.")
		}
		fmt.Println(string(data))
	}
}

// CheckCertificateKeyUsages This function returns a slice of strings cooresponding to a x509.KeyUsage bitmap
func CheckCertificateKeyUsages(keyUsage int) []string {
	var val []string
	if keyUsage & int(x509.KeyUsageDigitalSignature) != 0 {
		val = append(val, "DigitalSignature")
	}
	if keyUsage & int(x509.KeyUsageContentCommitment) != 0 {
		val = append(val, "ContentCommitment")
	}
	if keyUsage & int(x509.KeyUsageKeyEncipherment) != 0 {
		val = append(val, "KeyEncipherment")
	}
	if keyUsage & int(x509.KeyUsageDataEncipherment) != 0 {
		val = append(val, "DataEncipherment")
	}
	if keyUsage & int(x509.KeyUsageKeyAgreement) != 0 {
		val = append(val, "KeyAgreement")
	}
	if keyUsage & int(x509.KeyUsageCertSign) != 0 {
		val = append(val, "CertSign")
	}
	if keyUsage & int(x509.KeyUsageCRLSign) != 0 {
		val = append(val, "CRLSign")
	}
	if keyUsage & int(x509.KeyUsageEncipherOnly) != 0 {
		val = append(val, "EncipherOnly")
	}
	if keyUsage & int(x509.KeyUsageDecipherOnly) != 0 {
		val = append(val, "DecipherOnly")
	}
	return val
}
