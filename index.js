const cp = require('child_process');
const { idevice_id, CannotRetrieveDeviceListError, CannotMallocMemoryError, CannotReallocMemoryError } = require('./lib/idevice_id');
const { idevice_info, InfoInvalidDomainError, InfoUnkownError } = require('./lib/idevice_info');
const { UnkownErrror, LockdownError, IdeviceNoDeviceFoundError } = require('./lib/errors');

// Export errors
exports.UnkownErrror = UnkownErrror;
exports.CannotRetrieveDeviceListError = CannotRetrieveDeviceListError;
exports.CannotMallocMemoryError = CannotMallocMemoryError;
exports.CannotReallocMemoryError = CannotReallocMemoryError;
exports.InfoInvalidDomainError = InfoInvalidDomainError;
exports.InfoUnkownError = InfoUnkownError;
exports.LockdownError = LockdownError;
exports.IdeviceNoDeviceFoundError = IdeviceNoDeviceFoundError;

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


/**
 * Return device list found via usb and network.
 * @param {{debug: boolean, usblist: boolean, networklist: boolean}} [options]
 * @param {(error: (UnkownErrror | CannotRetrieveDeviceListError | CannotMallocMemoryError | CannotReallocMemoryError), idlist: {usblist: [string], networklist: [string]})} callback
 * 
 */
exports.id = (options, callback) => idevice_id(options, callback);

/**
 * Return information about the device.
 * @param {{debug: bool, simple: bool, udid: string, domain: string, key: string, network: bool}} options 
 * @param {(error: (IdeviceNoDeviceFoundError | InfoInvalidDomainError | InfoUnkownError | LockdownError), info: object)} callback 
 * 
 */
exports.info = (options, callback) => idevice_info(options, callback);

exports.pair = function(command, callback) {
	const child = cp.fork(`${__dirname}/lib/pair_worker`)
	child.send(command)
	child.on('message', res => {
		callback(res.err, res.data)
		child.disconnect()
	})
	return child
}