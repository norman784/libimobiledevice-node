const ref = require('ref')
const Struct = require('ref-struct')

const struct = Struct({
  session: 'void*',
  ctx: 'void*'
})

module.exports = function () {
  return struct
}

module.exports.ref = ref.refType(struct)
