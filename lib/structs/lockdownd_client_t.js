const ref = require('ref')
const Struct = require('ref-struct')
const property_list_service_client_t = require('./property_list_service_client_t')

const struct = Struct({
  parent: property_list_service_client_t.ref,
  ssl_enabled: 'int',
  session_id: 'char*',
  uuid: 'char*',
  label: 'char*'
})

module.exports = function () {
  return struct
}

module.exports.ref = ref.refType(struct)
