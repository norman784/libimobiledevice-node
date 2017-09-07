const libPath = `${__dirname}/dependencies/lib/libimobiledevice-node.dylib`

const ffi = require('ffi')
const struct = require('ref-struct')

const Options = struct({
  'debug': 'bool',
  'simple': 'bool',
  'udid': 'char*',
  'domain': 'char*',
  'key': 'char*'
})

console.log(libPath)

const callback = ffi.Callback('void', ['string', 'string'], (err, data) => {
  if (err) console.error(err)
  else console.log('DATA:\n', data)
})
const lib = ffi.Library(libPath, {
  'idevice_info': ['void', [Options.ref, 'pointer']]
})

var options = new Options()
lib.idevice_info(options, callback)

process.on('exit', () => callback)
