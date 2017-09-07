const ref = require('ref')
const Struct = require('ref-struct')
const idevice_connection_t = require('./idevice_connection_t')

const struct = Struct({
  parent: idevice_connection_t.ref
})

module.exports = function () {
  return struct
}

module.exports.ref = ref.refType(struct)
