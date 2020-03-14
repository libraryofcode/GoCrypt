import { randomBytes } from 'crypto';
import { PrivateKey } from '.';
import { CertificateRequestData, Certificates } from '../stores';
import { exec } from '../internals';

/**
 * Instance of a generated CSR, which are generated via {@link Certificates#createCertificateSigningRequest}
 */
export default class CSR {
  /**
   * The auto generated CSR ID, used for `.get()`ing the CSR from the Certificate#csrs collection.
   */
  public id: string;

  /**
   * The Private Key instance used to create this CSR.
   */
  public privateKey: PrivateKey;

  /**
   * The data used to create this CSR.
   */
  public data: CertificateRequestData;

  #b64: Buffer;

  /**
   * To create a CSR, call the `CSR.create();` function after instantiating the class.
   */
  constructor() {
    this.id = randomBytes(5).toString('hex');
  }

  /**
   * Creates a new Certificate Signing Request.
   * @param privateKey The Private Key instance to use to create the CSR. You can only create CSRs from Private Keys of type 'RSA' or 'EC'.
   * @param data The information to encode in the CSR.
   * @param passphrase Optional, if the provided Private Key has a passphrase, put the passphrase here.
   */
  public create(privateKey: PrivateKey, data: CertificateRequestData, passphrase?: string): CSR {
    if (!data) throw new Error('CertificateRequestData interface expected in second parameter, received nothing.');
    if (privateKey.type !== 'rsa' && privateKey.type !== 'ec') throw new Error(`Expected Private Key type to be 'EC' or 'RSA', received '${privateKey.type}'.`);
    const jsonD: { type?: 'pkcs1' | 'sec1', passphrase?: string } = {};
    if (privateKey.type === 'rsa') jsonD.type = 'pkcs1';
    else if (privateKey.type === 'ec') jsonD.type = 'sec1';
    if (passphrase) jsonD.passphrase = passphrase;
    const pemKey = privateKey.export(jsonD.type, 'pem', jsonD.passphrase).toString('utf8');
    const { Req }: { Req: string } = exec('csr', undefined, Buffer.from(JSON.stringify({ ...data, key: pemKey.toString() })).toString('hex'));
    this.#b64 = Buffer.from(Req);
    this.data = data;
    this.privateKey = privateKey;
    return this;
  }

  /**
   * Returns a Buffer of the PEM encoded CSR.
   * @example CSR.export().toString(); // -----BEGIN CERTIFICATE REQ...
   */
  public export() {
    return this.#b64;
  }

  /**
   * Saves/stores this CSR in a GoCrypt store collection.
   * @param store The instantiated store to set data on.
   * @example CSR.save(gocrypt.stores.certificates);
   */
  public save(store: Certificates): void {
    store.csrs.set(this.id, this);
  }
}
