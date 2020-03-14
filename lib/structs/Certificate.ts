import { randomBytes } from 'crypto';
import { Certificates } from '../stores';
import { exec } from '../internals';

export interface CertificateData {
  Subject: { Country: string[], Organization: string[], OrganizationalUnit: string[], StreetAddress: string[], PostalCode: string[], EmailAddress: string, CommonName: string, },
  Issuer: { Country: string[], Organization: string[], OrganizationalUnit: string[], StreetAddress: string[], PostalCode: string[], EmailAddress: string, CommonName: string, },
  San: { DNSNames: string[], EmailAddresses: string[], IPAddresses: string[], URIs: string[], },
  AuthorityInformationAccess: { OCSPServer: string[], IssuingCertificateURL: string[], },
  KeyUsage: ['DigitalSignature', 'ContentCommitment', 'KeyEncipherment', 'DataEncipherment', 'KeyAgreement', 'CertSign', 'CRLSign', 'EncipherOnly', 'DecipherOnly'],
  ExtendedKeyUsage: ['Any', 'ServerAuth', 'ClientAuth', 'CodeSigning', 'EmailProtection', 'TimeStamping', 'OCSPSigning'],
  IsCA: boolean,
  SerialNumber: string,
  PublicKeyAlgorithm: ['UnknownPublicKeyAlgorithm', 'RSA', 'DSA', 'ECDSA', 'Ed25519'],
  SignatureAlgorithm: ['MD2-RSA', 'MD5-RSA', 'SHA1-RSA', 'SHA256-RSA', 'SHA384-RSA', 'DSA-SHA1', 'DSA-SHA256', 'ECDSA-SHA1', 'ECDSA-SHA256', 'ECDSA-SHA384', 'ECDSA-SHA512', 'SHA256-RSAPSS', 'SHA384-RSAPSS', 'SHA512-RSAPSS', 'PureEd25519'],
  Version: number,
  NotBefore: Date,
  NotAfter: Date,
  PolicyIdentifiers: string[],
}

export default class Certificate {
  /**
   * The auto generated CSR ID, used for `.get()`ing the CSR from the Certificates collection.
   */
  public id: string;

  public subject: {
    /**
     * Country code for said country, a list can be found here: https://clients.hostingireland.ie/knowledgebase/2042/2-letter-country-codes-for-CSR-generation.html
     * The code should be only two characters in length. You can have multiple country codes, but you should only have one.
     * @example 'US'
     */
    country?: string[],
    /**
     * The name of the organization, frequently used in OV validated certificates. You can have multiple organization names, but you should only have one.
     * @example 'Library of Code sp-us'
     */
    organization?: string[],
    /**
     * The department, division, or function of the organization. This is frequently used in OV certificates, you can have multiple entires but you usually only need one.
     * @example 'Faculty Marshals'
     */
    organizationalUnit?: string[],
    streetAddress?: string[],
    postalCode?: string[]
    /**
     * The email address for the certificate.
     * @example 'marshals@libraryofcode.org'
     */
    emailAddress?: string;
    /**
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  };

  public issuer: {
    /**
     * Country code for said country, a list can be found here: https://clients.hostingireland.ie/knowledgebase/2042/2-letter-country-codes-for-CSR-generation.html
     * The code should be only two characters in length. You can have multiple country codes, but you should only have one.
     * @example 'US'
     */
    country?: string[],
    /**
     * The name of the organization, frequently used in OV validated certificates. You can have multiple organization names, but you should only have one.
     * @example 'Library of Code sp-us'
     */
    organization?: string[],
    /**
     * The department, division, or function of the organization. This is frequently used in OV certificates, you can have multiple entires but you usually only need one.
     * @example 'Faculty Marshals'
     */
    organizationalUnit?: string[],
    streetAddress?: string[],
    postalCode?: string[]
    /**
     * The email address for the certificate.
     * @example 'marshals@libraryofcode.org'
     */
    emailAddress?: string;
    /**
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  };

  /**
   * The Subject Alternative Name (SAN) is an extension to the X. 509 specification that allows users to specify additional host names for a single certificate.
   */
  public san: {
    /**
     * Additional domain names to be covered under this certificate.
     */
    dnsNames: string[],
    /**
     * Additional email addresses to be covered under this certificate.
     */
    emailAddresses: string[],
    /**
     * IP addresses that will be covered under this certificate.
     */
    ipAddresses: string[],
    uri: string[],
  }

  public authorityInformationAccess: {
    /**
     * Address of the OCSP responder from where revocation of this certificate can be checked.
     */
    ocspServer: string[],
    /**
     * Information about how to get the issuer of this certificate (CA issuer access method).
     * This can be a URL to a location that downloads the x.509 certificate that signed this certificate.
     */
    issuingCertificateURL: string[],
  }

  /**
   * Whether or not the certificate is a certification authority.
   */
  public isCA: boolean;

  /**
   * https://tools.ietf.org/html/rfc5280#section-4.2.1.3
   */
  public keyUsage: ['DigitalSignature', 'ContentCommitment', 'KeyEncipherment', 'DataEncipherment', 'KeyAgreement', 'CertSign', 'CRLSign', 'EncipherOnly', 'DecipherOnly'];

  /**
   * https://tools.ietf.org/html/rfc5280#section-4.2.1.12
   */
  public extendedKeyUsage: ['Any', 'ServerAuth', 'ClientAuth', 'CodeSigning', 'EmailProtection', 'TimeStamping', 'OCSPSigning'];

  public version: number;

  public serialNumber: string;

  public publicKeyAlgorithm: ['UnknownPublicKeyAlgorithm', 'RSA', 'DSA', 'ECDSA', 'Ed25519'];

  public signatureAlgorithm: ['MD2-RSA', 'MD5-RSA', 'SHA1-RSA', 'SHA256-RSA', 'SHA384-RSA', 'DSA-SHA1', 'DSA-SHA256', 'ECDSA-SHA1', 'ECDSA-SHA256', 'ECDSA-SHA384', 'ECDSA-SHA512', 'SHA256-RSAPSS', 'SHA384-RSAPSS', 'SHA512-RSAPSS', 'PureEd25519'];

  public expirationDates: {
    notBefore: Date,
    notAfter: Date,
  };

  public policyIdentifiers: string[];

  #b64: Buffer;

  /**
   *  To import a certificate, call the {@link Certificate#import} function after instantiating the class.
   */
  constructor() {
    this.id = randomBytes(5).toString('hex');
  }

  /**
   * This function imports a PEM encoded certificate.
   * @param certificate The PEM encoded certificate to import.
   */
  public import(certificate: string): Certificate {
    const certificateData: CertificateData = exec('certinfo', undefined, Buffer.from(certificate).toString('hex'));
    this.#b64 = Buffer.from(certificate);
    this.authorityInformationAccess = {
      issuingCertificateURL: certificateData.AuthorityInformationAccess?.IssuingCertificateURL,
      ocspServer: certificateData.AuthorityInformationAccess?.OCSPServer,
    };
    this.expirationDates = {
      notBefore: certificateData.NotBefore,
      notAfter: certificateData.NotAfter,
    };
    this.extendedKeyUsage = certificateData.ExtendedKeyUsage;
    this.isCA = certificateData.IsCA;
    this.issuer = {
      commonName: certificateData.Issuer?.CommonName,
      emailAddress: certificateData.Issuer?.EmailAddress,
      country: certificateData.Issuer?.Country,
      organization: certificateData.Issuer?.Organization,
      organizationalUnit: certificateData.Issuer?.OrganizationalUnit,
      postalCode: certificateData.Issuer?.PostalCode,
      streetAddress: certificateData.Issuer?.StreetAddress,
    };
    this.subject = {
      commonName: certificateData.Subject?.CommonName,
      emailAddress: certificateData.Subject?.EmailAddress,
      country: certificateData.Subject?.Country,
      organization: certificateData.Subject?.Organization,
      organizationalUnit: certificateData.Subject?.OrganizationalUnit,
      postalCode: certificateData.Subject?.PostalCode,
      streetAddress: certificateData.Subject?.StreetAddress,
    };
    this.keyUsage = certificateData.KeyUsage;
    this.publicKeyAlgorithm = certificateData.PublicKeyAlgorithm;
    this.san = {
      dnsNames: certificateData.San?.DNSNames,
      emailAddresses: certificateData.San?.EmailAddresses,
      ipAddresses: certificateData.San?.IPAddresses,
      uri: certificateData.San?.URIs,
    };
    this.serialNumber = certificateData.SerialNumber;
    this.signatureAlgorithm = certificateData.SignatureAlgorithm;
    this.version = certificateData.Version;
    this.policyIdentifiers = certificateData.PolicyIdentifiers;
    return this;
  }

  /**
   * Saves/stores this certificate in a GoCrypt store collection.
   * @param store The instantiated store to set data on.
   * @example PrivateKey.save(gocrypt.stores.certificates);
   */
  public save(store: Certificates): void {
    store.set(this.id, this);
  }

  /**
   * Returns a Buffer of the PEM encoded certificate.
   * @example Certificate.export().toString(); // -----BEGIN CERTIFICATE...
   */
  public export() {
    return Buffer.from(this.#b64);
  }
}
