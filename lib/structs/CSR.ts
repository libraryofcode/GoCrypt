import { PrivateKey } from '.';
import { CertificateRequestData } from '../classes';

/**
 * Instance of a generated CSR, which are generated via {@link Certificates#createCertificateSigningRequest}
 */
export default class CSR {
  /**
   * The auto generated CSR ID, used for `.get()`ing the CSR from the Certificate#csrs map.
   */
  public readonly id: string;

  /**
   * The Private Key instance used to create this CSR.
   */
  public readonly privateKey: PrivateKey;

  /**
   * The data used to create this CSR.
   */
  public readonly data: CertificateRequestData;

  private b64: string;

  /**
   * **INTERNAL** This constructor should only be called internally within the library, do not instantiate this class externally.
   * @param id The auto generated ID, should be 5 bytes in hexadecimal.
   * @param privateKey The Private Key instance used to create this CSR.
   * @param data The CertificateRequestData interface object used to create this CSR.
   * @param cpem The PEM encoded CSR.
   * @internal
   */
  constructor(id: string, privateKey: PrivateKey, data: CertificateRequestData, cpem: string) {
    this.id = id;
    this.privateKey = privateKey;
    this.data = data;
    this.b64 = Buffer.from(cpem).toString('base64');
  }

  /**
   * Returns a Buffer of the PEM encoded CSR.
   * @example CSR.export().toString(); // -----BEGIN CERTIFICATE REQ...
   */
  public export() {
    return Buffer.from(this.b64);
  }
}
