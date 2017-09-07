const lib = require('../build/Release/binding.node')

lib.idevice_info({}, (err, data) => console.log(err, data))
