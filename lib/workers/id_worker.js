const lib = require(`${__dirname}/../../build/Release/imobiledevice.node`)

process.on('message', options => {
	lib.idevice_id(options, (error, data) => {
		process.send({error: error, data: data});
	})
})