import crypto from 'crypto';

export default class PrivateKey {
  /**
   * The ID for this key, you can fetch this PrivateKey instance again either with the Keys.store map.
   */
  public readonly id: string;

  public readonly type: 'rsa' | 'rsa-pss' | 'dsa' | 'ec' | 'x25519' | 'x448' | 'ed25519' | 'ed448';

  public typeOID: '1.2.840.113549.1.1.1' | '1.2.840.113549.1.1.10' | '1.2.840.10040.4.1' | '1.2.840.10045.2.1' | '1.3.101.110' | '1.3.101.111' | '1.3.101.112' | '1.3.101.113';

  /**
   * Size of the embedded key in bytes.
   */
  public readonly size: number;

  /**
   * The size of the key in bits, only set on RSA/DSA keys, will be `undefined` on other types.
   */
  public readonly modulus: number;

  /**
   * The length of q for DSA keys in bits, and only set on DSA keys, will be `undefined` on other types.
   */
  public readonly divisor: number;

  /**
   * The elliptic curve for EC keys, and only set on EC keys, will be `undefined` on other types. Run `openssl ecparam -list_curves` to get a list of all curves supported by your machine.
   * **WARNING** If you imported a private key, Go currently only returns *vague* responses for the curve. This value will be set to the following if the key is EC & you imported the EC key:
   * P-224, P-256, P-384, or P-512.
   */

  public readonly curve: string;

  protected keyObject: crypto.KeyObject;

  /**
   * **INTERNAL** This constructor should only be called internally within the library, do not instantiate this class externally.
   * @param keyObject The key object from private key creation.
   * @param keyID The ID for this private key.
   * @param data Information relating to this private key.
   */
  constructor(keyObject: crypto.KeyObject, keyID: string, data: { modulusLength: number, divisorLength: number, curve: string }) {
    this.keyObject = keyObject;
    this.id = keyID;
    this.type = keyObject.asymmetricKeyType;
    this.size = keyObject.asymmetricKeySize;
    this.setTypeOID();
    if (data.modulusLength) {
      this.modulus = data.modulusLength;
    }
    if (data.divisorLength) {
      this.divisor = data.divisorLength;
    }
    if (data.curve) {
      this.curve = data.curve;
    }
  }

  /**
   * This method exports the private key object into a format to be used on systems.
   * @param type The block format. Often referred to as a header. PKCS1 can only be used for RSA keys, SEC1 can only be used for EC keys, and PKCS8 can be used for both.
   * @param format Essentially the "encoding" of the key, PEM produces a base64 key with headers, DER is binary. PEM is default.
   * @param passphrase Optional, but if provided the function will encrypt the private key with the passphrase. The cipher used is always AES-256-CBC.
   * @returns {Buffer} This function returns a Buffer of the key, even if its PEM. You can decode the buffer back to UTF8 to get the full text.
   */
  public export(type: 'pkcs1' | 'pkcs8' | 'sec1', format: 'pem' | 'der' = 'pem', passphrase?: string): Buffer {
    if (type !== 'pkcs1' && type !== 'pkcs8' && type !== 'sec1') {
      throw new TypeError('Invalid export type provided.');
    }
    if (format !== 'pem' && format !== 'der') {
      throw new TypeError('Invalid export format provided.');
    }

    if ((this.type === 'rsa' || this.type === 'rsa-pss') && (type !== 'pkcs1' && type !== 'pkcs8')) {
      throw new TypeError('RSA keys can only be exported with types PKCS1 and PKCS8.');
    }
    if (this.type === 'ec' && (type !== 'sec1' && type !== 'pkcs8')) {
      throw new TypeError('EC keys can only be exported with types');
    }
    let cipher: string;
    if (passphrase) {
      cipher = 'aes-256-cbc';
    }
    const exported = this.keyObject.export({
      type,
      // @ts-ignore
      format,
      cipher,
      passphrase,
    });
    if (Buffer.isBuffer(exported)) {
      return exported;
    }
    return Buffer.from(exported, 'utf8');
  }

  private setTypeOID() {
    if (this.type === 'rsa') {
      this.typeOID = '1.2.840.113549.1.1.1';
    } else if (this.type === 'rsa-pss') {
      this.typeOID = '1.2.840.113549.1.1.10';
    } else if (this.type === 'dsa') {
      this.typeOID = '1.2.840.10040.4.1';
    } else if (this.type === 'ec') {
      this.typeOID = '1.2.840.10045.2.1';
    } else if (this.type === 'x25519') {
      this.typeOID = '1.3.101.110';
    } else if (this.type === 'x448') {
      this.typeOID = '1.3.101.111';
    } else if (this.type === 'ed25519') {
      this.typeOID = '1.3.101.112';
    } else if (this.type === 'ed448') {
      this.typeOID = '1.3.101.113';
    }
  }
}
