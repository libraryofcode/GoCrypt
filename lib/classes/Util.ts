import ffi from 'ffi-napi';

/**
 * **INTERNAL** Constructor is not meant to be called externally.
 * *Includes Shared Object/Library Functions [GO]*
 * @class
 * @classdesc A general Utilities library.
 */
export default class Util {
  protected goLib: {
    RandomInt(max: number): { readCString(): string; },
    FreeString(pointer: any): void,
  };

  constructor() {
    this.goLib = ffi.Library(`${__dirname}/../build/func.so`, {
      RandomInt: ['char *', ['int']],
      FreeString: ['void', ['void *']],
    });
  }

  /**
   * This function produces a random integer value
   * [Shared Object Function (Go)]
   * @param max Value provided should be >= -2147483648 and <= 2147483647
   * @example Util.randomInt(500);
   */
  public randomInt(max: number) {
    if (typeof max !== 'number') {
      throw new TypeError(`Expected type 'number' for parameter value, received type of '${typeof max}'`);
    }
    const goResponse = this.goLib.RandomInt(max);
    const str = goResponse.readCString();
    const response: { Num: number, Err: string } = JSON.parse(str);
    this.goLib.FreeString(goResponse);
    if (response.Err) {
      throw new Error(response.Err);
    }
    return response.Num;
  }
}
