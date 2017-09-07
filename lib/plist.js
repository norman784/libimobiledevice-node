const ffi = require('ffi')
const libpath = `${__dirname}/../dependencies/lib/libplist.3.dylib`

const lib = ffi.Library(libpath, {
  plist_to_xml: ['void', ['pointer', 'char', 'int']]
})

module.exports = lib
