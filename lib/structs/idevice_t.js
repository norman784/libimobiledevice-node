const ref = require('ref')
const Struct = require('ref-struct')
const ArrayType = require('ref-array')

const struct = Struct({
  uuid: 'char*',
  conn_type: 'int',
  conn_data: 'void*',
  version: 'int'
})

module.exports = function () {
  return struct
}

module.exports.ref = ref.refType(struct)
