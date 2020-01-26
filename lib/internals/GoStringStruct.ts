import Struct from 'ref-struct-napi';

const GoStringStruct = Struct({
  p: 'string',
  n: 'long',
});

export default GoStringStruct;
