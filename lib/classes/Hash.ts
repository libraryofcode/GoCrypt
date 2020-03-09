import { exec } from '../internals';

export default class Hash {
  /**
   * This function takes data as a Buffer and returns a SHA256 checksum of said data.
   * @param data The data to generate a checksum from.
   * @example Hash.createSHA256Checksum(Buffer.from('hello, world!'));
   */
  public static createSHA256Checksum(data: Buffer): Buffer {
    const hashedObj: { Message: string } = exec('hashsha256', undefined, data.toString('hex'));
    return Buffer.from(hashedObj.Message, 'hex');
  }

  /**
   * This function takes data as a Buffer and returns a SHA512 checksum of said data.
   * @param data The data to generate a checksum from.
   * @example Hash.createSHA512Checksum(Buffer.from('hello, world!'));
   */
  public static createSHA512Checksum(data: Buffer): Buffer {
    const hashedObj: { Message: string } = exec('hashsha512', undefined, data.toString('hex'));
    return Buffer.from(hashedObj.Message, 'hex');
  }
}
