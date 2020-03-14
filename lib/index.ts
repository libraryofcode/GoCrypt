import * as stores from './stores';
import * as structs from './structs';

class GoCrypt {
  public stores: {
    certificates: stores.Certificates,
    keys: stores.Keys,
    util: typeof stores.Util,
    hash: typeof stores.Hash,
  };

  public CSR: typeof structs.CSR;

  public Certificate: typeof structs.Certificate;

  public PrivateKey: typeof structs.PrivateKey;

  constructor() {
    this.stores = {
      certificates: new stores.Certificates(),
      keys: new stores.Keys(),
      util: stores.Util,
      hash: stores.Hash,
    };
    this.CSR = structs.CSR;
    this.Certificate = structs.Certificate;
    this.PrivateKey = structs.PrivateKey;
  }
}

export default new GoCrypt();
