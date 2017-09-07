const ref = require('ref')
const Struct = require('ref-struct')
const ssl_data_t = require('./ssl_data_t')

const struct = Struct({
  uuid: 'char*',
  type: 'int',
  data: 'void*',
  ssl_data: ssl_data_t.ref
})

module.exports = function () {
  return struct
}

module.exports.ref = ref.refType(struct)
