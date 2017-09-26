const lib = require(`${__dirname}/build/Debug/binding.node`)

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
		return lib.idevice_backup2(options, callback, progress)
	}
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
		return lib.idevice_info(options, callback)
	}
}