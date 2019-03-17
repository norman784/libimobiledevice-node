const lib = require(`${__dirname}/../build/Release/imobiledevice.node`)

process.on('message', options => {
	lib.idevice_pair(options, (err, data) => {
		if (err) process.send({err: err})
		else process.send({data: data})
	})
})