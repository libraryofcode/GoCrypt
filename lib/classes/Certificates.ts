import { randomBytes } from 'crypto';
import { Certificate, CSR, PrivateKey } from '../structs';
import { exec } from '../internals';

export interface CertificateRequestData {
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
    organizationalUnit?: string[],
    streetAddress?: string[],
    postalCode?: string[]
    /**
     * The common name for the certificate. For server certificates this should be your domain name.
     * @example libraryofcode.org
     */
    commonName: string,
  },
  san?: {
    DNSNames?: string[],
    emailAddresses?: string[],
    IPAddresses?: string[],
  },
}

/**
 * **INTERNAL** Constructor is not meant to be called externally.
 * @class
 * @classdesc This class extends Map, and has functions relating to creation and information relating to x509 Certificates & CSRs.
 */
export default class Certificates extends Map<string, Certificate> {
  /**
   * A map keyed by a 5 byte hexadecimal string, containing all the CSRs created during this instance.
   * @example Certificates.csrs.get('id');
   */
  public csrs: Map<string, CSR>;

  constructor() {
    super();
    this.csrs = new Map();
  }

  /**
   * Creates a new Certificate Signing Request. The resulting CSR can be fetched later via `Certificates.csrs#get('idhere');`
   * @param privateKey The Private Key instance to use to create the CSR. You can only create CSRs from Private Keys of type 'RSA' or 'EC'.
   * @param data The information to encode in the CSR.
   * @param passphrase Optional, if the provided Private Key has a passphrase, put the passphrase here.
   */
  public createCertificateSigningRequest(privateKey: PrivateKey, data: CertificateRequestData, passphrase?: string): CSR {
    if (!data) throw new Error('CertificateRequestData interface expected in second parameter, received nothing.');
    if (privateKey.type !== 'rsa' && privateKey.type !== 'ec') throw new Error(`Expected Private Key type to be 'EC' or 'RSA', received '${privateKey.type}'.`);
    const jsonD: { type?: 'pkcs1' | 'sec1', passphrase?: string } = {};
    if (privateKey.type === 'rsa') jsonD.type = 'pkcs1';
    else if (privateKey.type === 'ec') jsonD.type = 'sec1';
    if (passphrase) jsonD.passphrase = passphrase;
    const pemKey = privateKey.export(jsonD.type, 'pem', jsonD.passphrase).toString('utf8');
    const { Req }: { Req: string } = exec('csr', undefined, Buffer.from(JSON.stringify({ ...data, key: pemKey.toString() })).toString('hex'));
    const id = randomBytes(5).toString('hex');
    const newCSR = new CSR(id, privateKey, data, Req);
    this.csrs.set(id, newCSR);
    return newCSR;
  }
}
