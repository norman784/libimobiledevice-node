const lib = require(`${__dirname}/../build/Release/imobiledevice.node`)

lib.idevice_id(data => process.send(data))