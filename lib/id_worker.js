const lib = require(`${__dirname}/../build/Debug/imobiledevice.node`)

lib.idevice_id(data => process.send(data))