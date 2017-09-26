const lib = require(`${__dirname}/../build/Debug/imobiledevice.node`)

process.on('message', options => {
	lib.idevice_backup2(options, (err, data) => {
		if (err) process.send({err: err})
		else process.send({data: data})
	}, progress => process.send({progress: progress}))
})