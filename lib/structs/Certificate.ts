export interface CertificateData {
  Subject: { Country: string[], Organization: string[], OrganizationalUnit: string[], StreetAddress: string[], PostalCode: string[], CommonName: string, },
  Issuer: { Country: string[], Organization: string[], OrganizationalUnit: string[], StreetAddress: string[], PostalCode: string[], CommonName: string, },
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
}

export default class Certificate {
  /**
   * The auto generated CSR ID, used for `.get()`ing the CSR from the Certificates collection.
   */
  public readonly id: string;

  public readonly subject: {
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
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  };

  public readonly issuer: {
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
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  };

  /**
   * The Subject Alternative Name (SAN) is an extension to the X. 509 specification that allows users to specify additional host names for a single certificate.
   */
  public readonly san: {
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

  public readonly authorityInformationAccess: {
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
  public readonly isCA: boolean;

  /**
   * https://tools.ietf.org/html/rfc5280#section-4.2.1.3
   */
  public readonly keyUsage: ['DigitalSignature', 'ContentCommitment', 'KeyEncipherment', 'DataEncipherment', 'KeyAgreement', 'CertSign', 'CRLSign', 'EncipherOnly', 'DecipherOnly'];

  /**
   * https://tools.ietf.org/html/rfc5280#section-4.2.1.12
   */
  public readonly extendedKeyUsage: ['Any', 'ServerAuth', 'ClientAuth', 'CodeSigning', 'EmailProtection', 'TimeStamping', 'OCSPSigning'];

  public readonly version: number;

  public readonly serialNumber: string;

  public readonly publicKeyAlgorithm: ['UnknownPublicKeyAlgorithm', 'RSA', 'DSA', 'ECDSA', 'Ed25519'];

  public readonly signatureAlgorithm: ['MD2-RSA', 'MD5-RSA', 'SHA1-RSA', 'SHA256-RSA', 'SHA384-RSA', 'DSA-SHA1', 'DSA-SHA256', 'ECDSA-SHA1', 'ECDSA-SHA256', 'ECDSA-SHA384', 'ECDSA-SHA512', 'SHA256-RSAPSS', 'SHA384-RSAPSS', 'SHA512-RSAPSS', 'PureEd25519'];

  public readonly expirationDates: {
    notBefore: Date,
    notAfter: Date,
  };

  private readonly b64: string;

  /**
   * **INTERNAL** This constructor should only be called internally within the library, do not instantiate this class externally.
   * @internal
   */
  constructor(certificateData: CertificateData, pem: string, id: string) {
    this.b64 = Buffer.from(pem).toString('base64');
    this.authorityInformationAccess.issuingCertificateURL = certificateData.AuthorityInformationAccess.IssuingCertificateURL;
    this.authorityInformationAccess.ocspServer = certificateData.AuthorityInformationAccess.OCSPServer;
    this.expirationDates.notBefore = certificateData.NotBefore;
    this.expirationDates.notAfter = certificateData.NotAfter;
    this.extendedKeyUsage = certificateData.ExtendedKeyUsage;
    this.isCA = certificateData.IsCA;
    this.issuer.commonName = certificateData.Issuer.CommonName;
    this.issuer.country = certificateData.Issuer.Country;
    this.issuer.organization = certificateData.Issuer.Organization;
    this.issuer.organizationalUnit = certificateData.Issuer.OrganizationalUnit;
    this.issuer.postalCode = certificateData.Issuer.PostalCode;
    this.issuer.streetAddress = certificateData.Issuer.PostalCode;
    this.subject.commonName = certificateData.Subject.CommonName;
    this.subject.country = certificateData.Subject.Country;
    this.subject.organization = certificateData.Subject.Organization;
    this.subject.organizationalUnit = certificateData.Subject.OrganizationalUnit;
    this.subject.postalCode = certificateData.Subject.PostalCode;
    this.subject.streetAddress = certificateData.Subject.PostalCode;
    this.keyUsage = certificateData.KeyUsage;
    this.publicKeyAlgorithm = certificateData.PublicKeyAlgorithm;
    this.san.dnsNames = certificateData.San.DNSNames;
    this.san.emailAddresses = certificateData.San.EmailAddresses;
    this.san.ipAddresses = certificateData.San.IPAddresses;
    this.san.uri = certificateData.San.URIs;
    this.serialNumber = certificateData.SerialNumber;
    this.signatureAlgorithm = certificateData.SignatureAlgorithm;
    this.version = certificateData.Version;
  }
}
