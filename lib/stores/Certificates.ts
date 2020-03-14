import { Certificate, Collection, CSR } from '../structs';

export interface CertificateRequestData {
  /**
   * The organization, entity, or machine that the certificate belongs to.
   */
  subject: {
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
  },
  /**
   * Subject Alternative Name (SAN) allows you to specify additional information for the certificate.
   * If you're making a server certificate for a HTTP server, you may want to set your domain names in `san.DNSNames` as web browsers require this.
   */
  san?: {
    /**
     * @example ['libraryofcode.org', 'cloud.libraryofcode.org', '*.cloud.libraryofcode.org'];
     */
    DNSNames?: string[],
    /**
     * @example ['help(at)libraryofcode.org', 'marshals(at)libraryofcode.org'];
     */
    emailAddresses?: string[],
    /**
     * @example ['63.141.252.134'];
     */
    IPAddresses?: string[],
  },
}

/**
 * This class extends Collection, and has functions relating to creation and information relating to x509 Certificates & CSRs.
 * @class
 */
export default class Certificates extends Collection<Certificate> {
  /**
   * A map keyed by a 5 byte hexadecimal string, containing all the CSRs created during this instance.
   * @example Certificates.csrs.get('id');
   */
  public csrs: Collection<CSR>;

  /**
   * @private
   */
  constructor() {
    super();
    this.csrs = new Collection();
  }
}
