
const cp = require('child_process');
const { native_idevice_errors, native_lockdown_errors, LockdownPasswordProtectedError, LockdownInvalidHostIdError, LockdownPairingDialongResponsoPendingError, LockdownUserDeniedPairingError, LockdownError, IdeviceNoDeviceFoundError } = require('./errors');


const native_pair_errors = {
    PAIR_E_SUCCESS: 0,
    PAIR_E_INVALID_COMMAND: -1,
    PAIR_E_UNKOWN_ERROR: -2
}

/**
 * Idevicepair error —Invalid command provided.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {number} code - Error code.
 */
class PairInvalidCommandError extends Error {
    /**
     * 
     * @param {string} message 
     */
    constructor(message) {
        super(message);
        this.name = 'PairInvalidCommandError';
        this.code = native_pair_errors.PAIR_E_INVALID_COMMAND;
    }
}

/**
 * Idevicepair error —Invalid command provided.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {number} pairErrorCode - Pair error code.
 * @property {number} ideviceErrorCode - Idevice error code.
 * @property {number} lockdownErrorCode - Lockdown error code.
 */
class PairUnkownError extends Error {
    /**
     * 
     * @param {string} message 
     * @param {number} pairErrorCode 
     * @param {number} ideviceErrorCode 
     * @param {number} lockdownErrorCode 
     */
    constructor(message, pairErrorCode, ideviceErrorCode, lockdownErrorCode) {
        super(message);
        this.name = 'PairUnkownError';
        this.pairErrorCode = pairErrorCode;
		this.ideviceErrorCode = ideviceErrorCode;
		this.lockdownErrorCode = lockdownErrorCode;
    }
}

const getPairParameters = (command, options, callback) => {
	if (typeof options === "function") {
		callback = options;
		options = null;
	}
	let pOptions = {
		debug: false,
		command: command,
		udid: null,
	};
	if(options) {
		pOptions.debug = options.debug || false;
		pOptions.udid = options.udid || null;
	}
	return {pOptions: pOptions, pCallback: callback};
}

exports.native_pair_errors = native_pair_errors;
exports.PairInvalidCommandError = PairInvalidCommandError;
exports.PairUnkownError = PairUnkownError;
exports.getPairParameters = getPairParameters;

exports.idevice_pair = function(options, callback) {
	const child = cp.fork(`${__dirname}/workers/pair_worker`)
	child.send(options)
	child.on('message', res => {
        let pairError = res.error.pairError;
        let ideviceError = res.error.ideviceError;
        let lockdownError = res.error.lockdownError;
        let errorMessage = res.error.errorMessage;
        let udid = res.error.udid;

        switch(true) {
            // SUCCESS: list and systembuid
            case (pairError === native_pair_errors.PAIR_E_SUCCESS
                && ideviceError === native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR 
                && lockdownError === native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR):
                callback(null, res.data);
                break;
            // SUCCESS: hostid
            case (pairError === native_pair_errors.PAIR_E_SUCCESS
                && ideviceError === native_idevice_errors.IDEVICE_E_SUCCESS 
                && lockdownError === native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR):
                callback(null, res.data);
                break;
            // SUCCESS: pair, validate, unpair commands
            case (pairError === native_pair_errors.PAIR_E_SUCCESS 
                && ideviceError === native_idevice_errors.IDEVICE_E_SUCCESS 
                && lockdownError === native_lockdown_errors.LOCKDOWN_E_SUCCESS):
                callback(null, res.data);
                break;
            case (pairError === native_pair_errors.PAIR_E_INVALID_COMMAND 
                && ideviceError === native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR 
                && lockdownError === native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR):
                callback(new PairInvalidCommandError(errorMessage), null);
                break;
            case (ideviceError === native_idevice_errors.IDEVICE_E_NO_DEVICE):
                callback(new IdeviceNoDeviceFoundError(errorMessage), null);
                break;
            case (lockdownError === native_lockdown_errors.LOCKDOWN_E_PASSWORD_PROTECTED):
                callback(new LockdownPasswordProtectedError(errorMessage, udid), null);
                break;
            case (lockdownError === native_lockdown_errors.LOCKDOWN_E_INVALID_HOST_ID):
                callback(new LockdownInvalidHostIdError(errorMessage, udid), null);
                break;
            case (lockdownError === native_lockdown_errors.LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING):
                callback(new LockdownPairingDialongResponsoPendingError(errorMessage, udid), null);
                break;
            case (lockdownError === native_lockdown_errors.LOCKDOWN_E_USER_DENIED_PAIRING):
                callback(new LockdownUserDeniedPairingError(errorMessage, udid), null);
                break;
            case (pairError === native_pair_errors.PAIR_E_UNKOWN_ERROR 
                && ideviceError === native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR 
                && lockdownError !== native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR):
                callback(new LockdownError(errorMessage, lockdownError), null);
                break;
            default:
                callback(new PairUnkownError(errorMessage, pairError, ideviceError, lockdownError), null);
                break;

        }
		child.disconnect()
	})
	return child
}