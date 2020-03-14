/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Collection, PrivateKey } from '../structs';

/**
 * This class extends Map, any functions on this class will store the result in the Map that this class extends for easy lookup later.
 * @class
 */
export default class Keys extends Collection<PrivateKey> {
  /**
   * @private
   */
  constructor() {
    super();
  }
}
