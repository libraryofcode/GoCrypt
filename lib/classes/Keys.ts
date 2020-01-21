import { generateKeyPairSync, KeyObject, randomBytes } from 'crypto';
import { PrivateKey } from '../structs';

export default class Keys {
  /**
   * A map storing all private keys generated in memory, values are keyed by their ID.
   */
  public store: Map<string, PrivateKey>;

  /**
   * Creates a new private key.
   * @param keyType The type of key to create. Should be one of the following: RSA, DSA, EC, ED25519, or ED448.
   * @param data Can be omitted for ED25519 & ED448 keys, the other types require some elements.
   * @param data.keyID An optional parameter for the key ID, this is the key for the `Keys.store` map, if not provided it is a randomly generated hexadecimal string.
   * @param data.modulusLength Required for RSA & DSA keys, recommended lengths in bits for this value are 1024, 2048 (standard) or 4096. Anything really over 4096 is overkill.
   * @param data.divisorLength Required for DSA keys.
   * @param data.namedCurve Required for EC keys, recommended and most used curve is `prime256-v1`.
   * @example Keys.createPrivateKey('ec', { namedCurve: 'prime256-v1' });
   */
  public createPrivateKey(keyType: 'rsa' | 'dsa' | 'ec' | 'ed25519' | 'ed448', data?: { keyID: string, modulusLength?: number, divisorLength?: number, namedCurve?: string }): PrivateKey {
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
    } else {
      throw new TypeError('Invalid key type provided.');
    }
    const newKey = new PrivateKey(privateKey, keyID, {
      modulusLength: data.modulusLength,
      divisorLength: data.divisorLength,
      curve: data.namedCurve,
    });
    this.store.set(keyID, newKey);
    return newKey;
  }
}
