const libpath = `${__dirname}/../dependencies/lib/libimobiledevice.6.dylib`

const ffi = require('ffi')
const ref = require('ref')

const idevice_t = require('./structs/idevice_t')
const lockdownd_client_t = require('./structs/lockdownd_client_t')
// const plist = require('./plist')

const lib = ffi.Library(libpath, {
  idevice_set_debug_level: ['void', ['int']],
  idevice_new: ['int', [idevice_t.ref, 'char']],
  idevice_free: ['int', [idevice_t.ref]],
  lockdownd_client_new: ['int', [idevice_t.ref, lockdownd_client_t.ref, 'char*']],
  lockdownd_client_new_with_handshake: ['int', [idevice_t.ref, lockdownd_client_t.ref, 'char*']],
  lockdownd_get_value: ['int', [lockdownd_client_t.ref, 'char*', 'char*', 'void*']],
  lockdownd_client_free: ['int', [lockdownd_client_t.ref]]
  // plist
  // plist_print_to_stream: ['void', ['pointer', 'pointer']],
  // plist_free: ['void', []]
})

lib.idevice_error_t = require('./enums/idevice_error_t')
lib.lockdownd_error_t = require('./enums/lockdownd_error_t')
lib.connection_type = require('./enums/connection_type')

lib.idevice_t = idevice_t()
lib.lockdownd_client_t = lockdownd_client_t()

module.exports = lib
