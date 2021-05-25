const cp = require('child_process');
const { LockdownError, native_lockdown_errors, native_idevice_errors, IdeviceNoDeviceFoundError } = require('./errors');
const plist = require('plist');

const native_idevice_info_errors = {
    INFO_E_ESUCCESS: 0,
    INFO_E_INVALID_DOMAIN: -1,
    INFO_E_UNKOWN_ERROR: -2
}

/**
 * Ideviceinfo error —invalid domain error.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {number} code - Error code.
 */
class InfoInvalidDomainError extends Error {
	/**
	 * 
	 * @param {string} message 
	 */
    constructor(message) {
        super(message);
		this.name = 'InfoInvalidDomainError';
        this.code = native_idevice_info_errors.INFO_E_INVALID_DOMAIN;
    }
}

/**
 * Ideviceinfo error —unkown error.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {number} infoErrorCode - Info error code.
 * @property {number} ideviceErrorCode - Idevice error code.
 * @property {number} lockdownErrorCode - Lockdown error code.
 */
class InfoUnkownError extends Error {
	/**
	 * 
	 * @param {string} message
	 * @param {number} infoErrorCode
	 * @param {number} ideviceErrorCode
	 * @param {number} lockdownErrorCode
	 */
    constructor(message, infoErrorCode, ideviceErrorCode, lockdownErrorCode) {
        super(message);
		this.name = 'InfoUnkownError'
        this.infoErrorCode = infoErrorCode;
		this.ideviceErrorCode = ideviceErrorCode;
		this.lockdownErrorCode = lockdownErrorCode;
    }
}

exports.InfoInvalidDomainError = InfoInvalidDomainError;
exports.InfoUnkownError = InfoUnkownError;
exports.native_idevice_info_errors = native_idevice_info_errors;

exports.idevice_info = function(options, callback) {
	if (typeof options === "function") {
		callback = options;
		options = null;
	}

	options = options || {};

	const child = cp.fork(`${__dirname}/workers/info_worker`);
	child.send(options)
	child.on('message', res => {
		let infoError = res.error.infoError;
		let ideviceError = res.error.ideviceError;
		let lockdownError = res.error.lockdownError;
		let errorMessage = res.error.errorMessage;
		switch(true) {
			case (infoError === native_idevice_info_errors.INFO_E_ESUCCESS &&
					ideviceError === native_idevice_errors.IDEVICE_E_SUCCESS &&
					lockdownError === native_lockdown_errors.LOCKDOWN_E_SUCCESS):
				callback(null, res.data ? plist.parse(res.data) : {});
				break;
			case (ideviceError === native_idevice_errors.IDEVICE_E_NO_DEVICE):
				callback(new IdeviceNoDeviceFoundError(errorMessage), null);
				break;
			case (infoError === native_idevice_info_errors.INFO_E_INVALID_DOMAIN):
				callback(new InfoInvalidDomainError(errorMessage), null);
				break;
			case (infoError === native_idevice_info_errors.INFO_E_UNKOWN_ERROR &&
					ideviceError === native_idevice_errors.IDEVICE_E_SUCCESS && 
					lockdownError !== native_lockdown_errors.LOCKDOWN_E_SUCCESS):
				callback(new LockdownError(errorMessage, lockdownError), null);
				break;
			default:
				callback(new InfoUnkownError(errorMessage, infoError, ideviceError, lockdownError), null);
				break;

		}
		child.disconnect()
	})
	return child

}