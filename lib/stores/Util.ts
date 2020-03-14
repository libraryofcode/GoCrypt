/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
import { exec } from '../internals';

/**
 * A general utilities library.
 * @class
 */
export default class Util {
  /**
   * This function produces a cryptographically secure random integer value.
   * @param max Value provided should be >= -2147483648 and <= 2147483647
   * @example Util.randomInt(500);
   */
  public static randomInt(max: number): number {
    if (max <= -2147483648 || max >= 2147483647) throw new RangeError('Value provided should be >= -2147483648 and <= 2147483647.');
    const result: { Message: number } = exec('randint', [max]);
    return result.Message;
  }
}
