const ref = require('ref')
const Struct = require('ref-struct')
const service_client_t = require('./service_client_t')

const struct = Struct({
  parent: service_client_t.ref
})

module.exports = function () {
  return struct
}

module.exports.ref = ref.refType(struct)
