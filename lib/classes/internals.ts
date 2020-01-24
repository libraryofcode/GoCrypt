import Struct from 'ref-struct-napi';

const GoStringStruct = Struct({
  p: 'string',
  n: 'long',
});
class GoString extends GoStringStruct {
  // GoString (cgo) -> JavaScript string
  static get(buffer, offset) {
    // eslint-disable-next-line no-underscore-dangle
    const _gs = GoStringStruct.get(buffer, offset);
    return _gs.p.slice(0, _gs.n);
  }

  // JavaScript string -> GoString (cgo)
  static set(buffer, offset, value) {
    // eslint-disable-next-line no-underscore-dangle
    const _gs = new GoStringStruct({
      p: value,
      n: value.length,
    });
    return GoStringStruct.set(buffer, offset, _gs);
  }
}

export default {
  GoString,
  GoStringStruct,
};
