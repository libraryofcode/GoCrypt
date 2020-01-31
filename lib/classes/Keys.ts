/* eslint-disable @typescript-eslint/no-useless-constructor */
import { createPrivateKey, generateKeyPairSync, KeyObject, randomBytes } from 'crypto';
import { PrivateKey } from '../structs';
import { exec } from '../internals';

/**
 * This class extends Map, any functions on this class will store the result in the Map that this class extends for easy lookup later.
 * @class
 */
export default class Keys extends Map<string, PrivateKey> {
  /**
   * @internal
   */
  constructor() {
    super();
  }

  /**
   * Creates a new private key. Resulting private key can be retrieved later by using `Keys.get('keyID');`.
   * @param keyType The type of key to create. Should be one of the following: RSA, DSA, EC, ED25519, or ED448.
   * @param data Can be omitted for ED25519 & ED448 keys, the other types require some elements.
   * @param data.keyID An optional parameter for the key ID, this is the key for the `Keys.store` map, if not provided it is a randomly generated hexadecimal string.
   * @param data.modulusLength Required for RSA & DSA keys, recommended lengths in bits for this value are 1024, 2048 (standard) or 4096. Anything really over 4096 is overkill.
   * @param data.divisorLength Required for DSA keys.
   * @param data.namedCurve Required for EC keys, recommended and most used curve is `prime256v1`.
   * @example Keys.createPrivateKey('ec', { namedCurve: 'prime256v1' });
   */
  public createPrivateKey(keyType: 'rsa' | 'dsa' | 'ec' | 'ed25519' | 'ed448', data?: { keyID?: string, modulusLength?: number, divisorLength?: number, namedCurve?: string }): PrivateKey {
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
    let keyID: string;
    if (data.keyID) {
      keyID = data.keyID;
    } else {
      keyID = randomBytes(5).toString('hex');
    }
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
    const newKey = new PrivateKey(privateKey, keyID, {
      modulusLength: data.modulusLength,
      divisorLength: data.divisorLength,
      curve: data.namedCurve,
    });
    this.set(keyID, newKey);
    return newKey;
  }

  /**
   * Imports an already existing private key. This function only supports RSA & ECC keys at the moment. Resulting private key can be retrieved later by using `Keys.get('keyID');`
   * @param key PEM/DER encoded private key, if the encoding is DER, you should pass `data.format` in the second argument with the value of 'der', as well as `data.type` with the value of the key headers.
   * @param data Optional information about private key format & type, required if the key is in DER encoding.
   * @param data.format Required to specify 'der' as this parameter if the key passed is in DER encoding.
   * @param data.type Required to specify the headers type if the key passed is in DER encoding.
   */
  public importPrivateKey(key: string, data?: { format?: 'pem' | 'der', type?: 'pkcs1' | 'sec1', passphrase?: string }): PrivateKey {
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
    const keyID = randomBytes(5).toString('hex');
    let newKey: PrivateKey;
    const result: { Type: string, Curve: string, Modulus: number } = exec('pkinfo', undefined, Buffer.from(checkKey, 'utf8').toString('hex'));
    if (result.Type === 'RSA') {
      newKey = new PrivateKey(keyObject, keyID, { modulusLength: result.Modulus, divisorLength: undefined, curve: undefined });
    }
    if (result.Type === 'EC') {
      newKey = new PrivateKey(keyObject, keyID, { modulusLength: undefined, divisorLength: undefined, curve: result.Curve });
    }
    this.set(keyID, newKey);
    return newKey;
  }
}
