// eslint-disable-next-line max-classes-per-file
import ffi from 'ffi-napi';

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

  public randomInt(max: number) {
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
