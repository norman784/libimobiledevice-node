const cp = require('child_process')

exports.backup2 = function(options, callback, progress) {
	if (typeof options === 'function') {
		if (typeof callback === 'function') progress = callback
		callback = options
		options = null
	}

	options = options || {}

	if (options.uuid && !options.udid) options.udid = options.uuid

	if (options.constructor.name !== 'Object') {
		callback(Error('Options must be an object'), null)
	} else if (typeof callback !== 'function') {
		callback(Error('Callback is not a function'), null)
	} else if (typeof progress !== 'function') {
		callback(Error('Progress callback is not a function'), null)
	} else {
		const child = cp.fork(`${__dirname}/lib/backup2_worker`)
		child.send(options)
		child.on('message', res => {
			if (res.progress) progress(res.progress)
			else {
				callback(res.err, res.data)
				child.disconnect()
			}
		})
		return child
	}

	return null
}

exports.id = function(callback) {
	if (typeof callback !== 'function') {
		callback(Error('Callback is not a function'), null)
	} else {
		const child = cp.fork(`${__dirname}/lib/id_worker`)
		child.on('message', data => {
			callback(data)
			child.disconnect()
		})
		return child
	}

	return null
}

exports.info = function(options, callback) {
	if (typeof options === "function") {
		callback = options
		options = null
	}

	options = options || {}

	if (options.constructor.name !== 'Object') {
		callback(Error('Options must be an object'), null)
	} else if (typeof callback !== 'function') {
		callback(Error('Callback is not a function'), null)
	} else {
		const child = cp.fork(`${__dirname}/lib/info_worker`)
		child.send(options)
		child.on('message', res => {
			callback(res.err, res.data)
			child.disconnect()
		})
		return child
	}

	return null
}