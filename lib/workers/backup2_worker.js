const lib = require(`${__dirname}/../../build/Release/imobiledevice.node`)

process.on('message', options => {
	lib.idevice_backup2(options, (error, data) => {
		process.send({error: error, data: data});
	}, progress => process.send({progress: progress}))
})