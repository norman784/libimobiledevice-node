const cp = require('child_process');
const { idevice_id, CannotRetrieveDeviceListError, CannotMallocMemoryError, CannotReallocMemoryError } = require('./lib/idevice_id');
const { idevice_info, InfoInvalidDomainError, InfoUnkownError } = require('./lib/idevice_info');
const { UnkownErrror, IdeviceNoDeviceFoundError, LockdownPasswordProtectedError, LockdownInvalidHostIdError, LockdownPairingDialongResponsoPendingError, LockdownUserDeniedPairingError, LockdownError } = require('./lib/errors');
const { PairInvalidCommandError, PairUnkownError, idevice_pair, getPairParameters } = require('./lib/idevice_pair');

// Export errors
exports.UnkownErrror = UnkownErrror;
exports.CannotRetrieveDeviceListError = CannotRetrieveDeviceListError;
exports.CannotMallocMemoryError = CannotMallocMemoryError;
exports.CannotReallocMemoryError = CannotReallocMemoryError;
// Info errors
exports.InfoInvalidDomainError = InfoInvalidDomainError;
exports.InfoUnkownError = InfoUnkownError;
// Idevice errors
exports.IdeviceNoDeviceFoundError = IdeviceNoDeviceFoundError;
// Lockdown errors
exports.LockdownPasswordProtectedError = LockdownPasswordProtectedError;
exports.LockdownInvalidHostIdError = LockdownInvalidHostIdError;
exports.LockdownPairingDialongResponsoPendingError = LockdownPairingDialongResponsoPendingError;
exports.LockdownUserDeniedPairingError = LockdownUserDeniedPairingError;
exports.LockdownError = LockdownError;
// Pair errors
exports.PairInvalidCommandError = PairInvalidCommandError;
exports.PairUnkownError = PairUnkownError;

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

exports.pair = {
	/**
	 * pair –will try to pair to the device, if it has success then will return the udid.
	 * @param {{debug: boolean, udid: string}} [options]
	 * @param {(error: (PairInvalidCommandError | IdeviceNoDeviceFoundError | LockdownPasswordProtectedError | LockdownInvalidHostIdError | LockdownPairingDialongResponsoPendingError | LockdownUserDeniedPairingError | LockdownError | PairUnkownError), udid: string)} callback 
	 */
	pair: (options, callback) => { 
		const {pOptions, pCallback} = getPairParameters('pair', options, callback);
		idevice_pair(pOptions, pCallback);
	},
	/**
	 * validate –will try to validate if the device is paired with the computer, if it is, then will return the device udid.
	 * @param {{debug: boolean, udid: string}} [options]
	 * @param {(error: (PairInvalidCommandError | IdeviceNoDeviceFoundError | LockdownPasswordProtectedError | LockdownInvalidHostIdError | LockdownPairingDialongResponsoPendingError | LockdownUserDeniedPairingError | LockdownError | PairUnkownError), udid: string)} callback 
	 */
	validate: (options, callback) => { 
		const {pOptions, pCallback} = getPairParameters('validate', options, callback);
		idevice_pair(pOptions, pCallback);
	},
	/**
	 * unpair –will try to unpair the device, if it success, then will return the device udid.
	 * @param {{debug: boolean, udid: string}} [options]
	 * @param {(error: (PairInvalidCommandError | IdeviceNoDeviceFoundError | LockdownInvalidHostIdError | LockdownError | PairUnkownError), udid: string)} callback 
	 */
	unpair: (options, callback) => { 
		const {pOptions, pCallback} = getPairParameters('unpair', options, callback);
		idevice_pair(pOptions, pCallback);
	},
	/**
	 * list –will try to list all the devices paired with the computer.
	 * Note: This command seems to be broken in libimobiledevice.
	 * @param {{debug: boolean, udid: string}} [options]
	 * @param {(error: (PairInvalidCommandError | LockdownError | PairUnkownError), udids: string)} callback 
	 */
	list: (options, callback) => {
		const {pOptions, pCallback} = getPairParameters('list', options, callback);
		idevice_pair(pOptions, pCallback);
	},
	/**
	 * systembuid –returns the system buid of the usbmuxd host.
	 * @param {{debug: boolean, udid: string}} [options]
	 * @param {(error: (PairInvalidCommandError | LockdownError | PairUnkownError), systembuid: string)} callback 
	 */
	systembuid: (options, callback) => {
		const {pOptions, pCallback} = getPairParameters('systembuid', options, callback);
		idevice_pair(pOptions, pCallback); 
	},
	/**
	 * systembuid –returns the system buid of the usbmuxd host.
	 * @param {{debug: boolean, udid: string}} [options]
	 * @param {(error: (PairInvalidCommandError | LockdownError | PairUnkownError), hostid: string)} callback 
	 */
	hostid: (options, callback) => {
		const {pOptions, pCallback} = getPairParameters('hostid', options, callback);
		idevice_pair(pOptions, pCallback);
	}
}