import { createPrivateKey, generateKeyPairSync, KeyObject, randomBytes } from 'crypto';
import { Keys } from '../stores';
import { exec } from '../internals';

export default class PrivateKey {
  public id: string;

  public type: 'rsa' | 'rsa-pss' | 'dsa' | 'ec' | 'x25519' | 'x448' | 'ed25519' | 'ed448';

  public typeOID: '1.2.840.113549.1.1.1' | '1.2.840.113549.1.1.10' | '1.2.840.10040.4.1' | '1.2.840.10045.2.1' | '1.3.101.110' | '1.3.101.111' | '1.3.101.112' | '1.3.101.113';

  /**
   * Size of the embedded key in bytes.
   */
  public size: number;

  /**
   * The size of the key in bits, only set on RSA/DSA keys, will be `undefined` on other types.
   */
  public modulus: number;

  /**
   * The length of q for DSA keys in bits, and only set on DSA keys, will be `undefined` on other types.
   */
  public divisor: number;

  /**
   * The elliptic curve for EC keys, and only set on EC keys, will be `undefined` on other types. Run `openssl ecparam -list_curves` to get a list of all curves supported by your machine.
   * **WARNING** If you imported a private key, Go currently only returns *vague* responses for the curve. This value will be set to the following if the key is EC & you imported the EC key:
   * P-224, P-256, P-384, or P-512.
   */

  public curve: string;

  #keyObject: KeyObject;

  #locked: boolean;

  /**
   * Call {@link PrivateKey#create} to create a new private key.
   * To import an already existing one, see {@link PrivateKey#import}
   */
  constructor() {
    this.id = randomBytes(5).toString('hex');
  }

  /**
   * Creates a private key.
   * @param keyType The type of key to create. Should be one of the following: RSA, DSA, EC, ED25519, or ED448.
   * @param data Can be omitted for ED25519 & ED448 keys, the other types require some elements.
   * @param data.modulusLength Required for RSA & DSA keys, recommended lengths in bits for this value are 1024, 2048 (standard) or 4096. Anything really over 4096 is overkill.
   * @param data.divisorLength Required for DSA keys.
   * @param data.namedCurve Required for EC keys, recommended and most used curve is `prime256v1`.
   * @example Keys.create('ec', { namedCurve: 'prime256v1' });
   */
  public create(keyType: 'rsa' | 'dsa' | 'ec' | 'ed25519' | 'ed448', data?: { modulusLength?: number, divisorLength?: number, namedCurve?: string }): PrivateKey {
    if (this.#locked) {
      throw new Error(`${this.constructor.name} class locked. You cannot call 'create' or 'import' functions more than once.`);
    }
    if (!data) {
      // eslint-disable-next-line no-param-reassign
      data = {};
    }
    if (!keyType) {
      throw new TypeError('Key type is required.');
    }
    if ((keyType === 'rsa' || keyType === 'dsa') && !data.modulusLength) {
      throw new TypeError('Modulus length is required for RSA & DSA keys.');
    }
    if (keyType === 'dsa' && !data.divisorLength) {
      throw new TypeError('Divisor length is required for DSA keys');
    }
    if (keyType === 'ec' && !data.namedCurve) {
      throw new TypeError('Named curve is required for EC keys.');
    }
    let privateKey: KeyObject;
    if (keyType === 'rsa') {
      try {
        const gen = generateKeyPairSync(keyType, {
          modulusLength: data.modulusLength,
        });
        privateKey = gen.privateKey;
      } catch (err) {
        throw new TypeError(`Invalid modulus length provided.\n${err}`);
      }
    } else if (keyType === 'dsa') {
      try {
        const gen = generateKeyPairSync(keyType, {
          modulusLength: data.modulusLength,
          divisorLength: data.divisorLength,
        });
        privateKey = gen.privateKey;
      } catch (err) {
        throw new TypeError(`Invalid modulus or divisor length provided.\n${err}`);
      }
    } else if (keyType === 'ec') {
      try {
        const gen = generateKeyPairSync(keyType, {
          namedCurve: data.namedCurve,
        });
        privateKey = gen.privateKey;
      } catch (err) {
        throw new TypeError(`Invalid EC named curve provided.\n${err}`);
      }
    } else if (keyType === 'ed25519') {
      // @ts-ignore
      const gen = generateKeyPairSync(keyType, {});
      privateKey = gen.privateKey;
    } else if (keyType === 'ed448') {
      // @ts-ignore
      const gen = generateKeyPairSync(keyType, {});
      privateKey = gen.privateKey;
    } else {
      throw new TypeError('Invalid key type provided.');
    }
    this.#keyObject = privateKey;
    if (data.modulusLength) {
      this.modulus = data.modulusLength;
    }
    if (data.divisorLength) {
      this.divisor = data.divisorLength;
    }
    if (data.namedCurve) {
      this.curve = data.namedCurve;
    }
    this.type = this.#keyObject.asymmetricKeyType;
    this.size = this.#keyObject.asymmetricKeySize;
    this.setTypeOID();
    this.#locked = true;
    return this;
  }

  /**
   * Imports an already existing private key. This function only supports RSA & ECC keys at the moment. Resulting private key can be retrieved later by using `Keys.get('keyID');`
   * @param key PEM/DER encoded private key, if the encoding is DER, you should pass `data.format` in the second argument with the value of 'der', as well as `data.type` with the value of the key headers.
   * @param data Optional information about private key format & type, required if the key is in DER encoding.
   * @param data.format Required to specify 'der' as this parameter if the key passed is in DER encoding.
   * @param data.type Required to specify the headers type if the key passed is in DER encoding.
   */
  public import(key: string, data?: { format?: 'pem' | 'der', type?: 'pkcs1' | 'sec1', passphrase?: string }): PrivateKey {
    if (this.#locked) {
      throw new Error(`${this.constructor.name} class locked. You cannot call 'create' or 'import' functions more than once.`);
    }
    const params: { key: string, format?: 'pem' | 'der', type?: 'pkcs1' | 'sec1', passphrase?: string } = { key };
    let checkKey: string;
    if (data) {
      if (data.format) {
        params.format = data.format;
      }
      if (data.format === 'der' && data.type) {
        params.type = data.type;
      } else if (data.format && !data.type) {
        throw new Error('Key encode type is required if the format of the key is \'der\'.');
      }
      if (data.passphrase) {
        params.passphrase = data.passphrase;
      }
    }
    const keyObject = createPrivateKey(params);
    if (data && data.format === 'der') {
      checkKey = keyObject.export({ type: params.type, format: 'pem' }).toString();
    } else {
      checkKey = key;
    }
    const result: { Type: string, Curve: string, Modulus: number } = exec('pkinfo', undefined, Buffer.from(checkKey, 'utf8').toString('hex'));
    this.#keyObject = keyObject;
    if (result.Type === 'RSA') {
      // newKey = new PrivateKey(keyObject, keyID, { modulusLength: result.Modulus, divisorLength: undefined, curve: undefined });
      this.modulus = result.Modulus;
      this.divisor = undefined;
      this.curve = undefined;
    }
    if (result.Type === 'EC') {
      // newKey = new PrivateKey(keyObject, keyID, { modulusLength: undefined, divisorLength: undefined, curve: result.Curve });
      this.modulus = undefined;
      this.divisor = undefined;
      this.curve = result.Curve;
    }
    this.#locked = true;
    return this;
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
    const exported = this.#keyObject.export({
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

  /**
   * Saves/stores this key in a GoCrypt store collection.
   * @param store The instantiated store to set data on.
   * @example PrivateKey.save(gocrypt.stores.keys);
   */
  public save(store: Keys): void {
    store.set(this.id, this);
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
