
const native_lockdown_errors = {
    LOCKDOWN_E_SUCCESS                                :   0,
	LOCKDOWN_E_INVALID_ARG                            :  -1,
	LOCKDOWN_E_INVALID_CONF                           :  -2,
	LOCKDOWN_E_PLIST_ERROR                            :  -3,
	LOCKDOWN_E_PAIRING_FAILED                         :  -4,
	LOCKDOWN_E_SSL_ERROR                              :  -5,
	LOCKDOWN_E_DICT_ERROR                             :  -6,
	LOCKDOWN_E_RECEIVE_TIMEOUT                        :  -7,
	LOCKDOWN_E_MUX_ERROR                              :  -8,
	LOCKDOWN_E_NO_RUNNING_SESSION                     :  -9,
	LOCKDOWN_E_INVALID_RESPONSE                       : -10,
	LOCKDOWN_E_MISSING_KEY                            : -11,
	LOCKDOWN_E_MISSING_VALUE                          : -12,
	LOCKDOWN_E_GET_PROHIBITED                         : -13,
	LOCKDOWN_E_SET_PROHIBITED                         : -14,
	LOCKDOWN_E_REMOVE_PROHIBITED                      : -15,
	LOCKDOWN_E_IMMUTABLE_VALUE                        : -16,
	LOCKDOWN_E_PASSWORD_PROTECTED                     : -17,
	LOCKDOWN_E_USER_DENIED_PAIRING                    : -18,
	LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING        : -19,
	LOCKDOWN_E_MISSING_HOST_ID                        : -20,
	LOCKDOWN_E_INVALID_HOST_ID                        : -21,
	LOCKDOWN_E_SESSION_ACTIVE                         : -22,
	LOCKDOWN_E_SESSION_INACTIVE                       : -23,
	LOCKDOWN_E_MISSING_SESSION_ID                     : -24,
	LOCKDOWN_E_INVALID_SESSION_ID                     : -25,
	LOCKDOWN_E_MISSING_SERVICE                        : -26,
	LOCKDOWN_E_INVALID_SERVICE                        : -27,
	LOCKDOWN_E_SERVICE_LIMIT                          : -28,
	LOCKDOWN_E_MISSING_PAIR_RECORD                    : -29,
	LOCKDOWN_E_SAVE_PAIR_RECORD_FAILED                : -30,
	LOCKDOWN_E_INVALID_PAIR_RECORD                    : -31,
	LOCKDOWN_E_INVALID_ACTIVATION_RECORD              : -32,
	LOCKDOWN_E_MISSING_ACTIVATION_RECORD              : -33,
	LOCKDOWN_E_SERVICE_PROHIBITED                     : -34,
	LOCKDOWN_E_ESCROW_LOCKED                          : -35,
	LOCKDOWN_E_PAIRING_PROHIBITED_OVER_THIS_CONNECTION: -36,
	LOCKDOWN_E_FMIP_PROTECTED                         : -37,
	LOCKDOWN_E_MC_PROTECTED                           : -38,
	LOCKDOWN_E_MC_CHALLENGE_REQUIRED                  : -39,
	LOCKDOWN_E_UNKNOWN_ERROR                          : -256
};

const native_idevice_errors = {
	IDEVICE_E_SUCCESS        :  0,
	IDEVICE_E_INVALID_ARG    : -1,
	IDEVICE_E_UNKNOWN_ERROR  : -2,
	IDEVICE_E_NO_DEVICE      : -3,
	IDEVICE_E_NOT_ENOUGH_DATA: -4,
	IDEVICE_E_SSL_ERROR      : -6,
	IDEVICE_E_TIMEOUT        : -7
}

const native_lockdown_errors_dict = {
	'0'  : 'LOCKDOWN_E_SUCCESS',                                
	'-1' : 'LOCKDOWN_E_INVALID_ARG',
	'-2' : 'LOCKDOWN_E_INVALID_CONF',                           
	'-3' : 'LOCKDOWN_E_PLIST_ERROR',                        
	'-4' : 'LOCKDOWN_E_PAIRING_FAILED',                         
	'-5' : 'LOCKDOWN_E_SSL_ERROR',                       
	'-6' : 'LOCKDOWN_E_DICT_ERROR',                            
	'-7' : 'LOCKDOWN_E_RECEIVE_TIMEOUT',
	'-8' : 'LOCKDOWN_E_MUX_ERROR',                      
	'-9' : 'LOCKDOWN_E_NO_RUNNING_SESSION',
	'-10': 'LOCKDOWN_E_INVALID_RESPONSE',                   
	'-11': 'LOCKDOWN_E_MISSING_KEY',                     
	'-12': 'LOCKDOWN_E_MISSING_VALUE',                          
	'-13': 'LOCKDOWN_E_GET_PROHIBITED',                        
	'-14': 'LOCKDOWN_E_SET_PROHIBITED ',                       
	'-15': 'LOCKDOWN_E_REMOVE_PROHIBITED',                      
	'-16': 'LOCKDOWN_E_IMMUTABLE_VALUE',                     
	'-17': 'LOCKDOWN_E_PASSWORD_PROTECTED',                     
	'-18': 'LOCKDOWN_E_USER_DENIED_PAIRING',                   
	'-19': 'LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING',
	'-20': 'LOCKDOWN_E_MISSING_HOST_ID',      
	'-21': 'LOCKDOWN_E_INVALID_HOST_ID',                      
	'-22': 'LOCKDOWN_E_SESSION_ACTIVE',                      
	'-23': 'LOCKDOWN_E_SESSION_INACTIVE',                       
	'-24': 'LOCKDOWN_E_MISSING_SESSION_ID',                     
	'-25': 'LOCKDOWN_E_INVALID_SESSION_ID',                   
	'-26': 'LOCKDOWN_E_MISSING_SERVICE',                   
	'-27': 'LOCKDOWN_E_INVALID_SERVICE',                      
	'-28': 'LOCKDOWN_E_SERVICE_LIMIT',                      
	'-29': 'LOCKDOWN_E_MISSING_PAIR_RECORD',                    
	'-30': 'LOCKDOWN_E_SAVE_PAIR_RECORD_FAILED',
	'-31': 'LOCKDOWN_E_INVALID_PAIR_RECORD',              
	'-32': 'LOCKDOWN_E_INVALID_ACTIVATION_RECORD',
	'-33': 'LOCKDOWN_E_MISSING_ACTIVATION_RECORD',            
	'-34': 'LOCKDOWN_E_SERVICE_PROHIBITED',            
	'-35': 'LOCKDOWN_E_ESCROW_LOCKED',                   
	'-36': 'LOCKDOWN_E_PAIRING_PROHIBITED_OVER_THIS_CONNECTION',
	'-37': 'LOCKDOWN_E_FMIP_PROTECTED',
	'-38': 'LOCKDOWN_E_MC_PROTECTED',                       
	'-39': 'LOCKDOWN_E_MC_CHALLENGE_REQUIRED',                  
	'-256': 'LOCKDOWN_E_UNKNOWN_ERROR'                
};

/**
 * Libimobiledevice lockdown error —cannot validate due to a passcode is set.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {string} udid - Device udid.
 * @property {number} code - Error code.
 */
exports.LockdownPasswordProtectedError = class LockdownPasswordProtectedError extends Error {
	/**
	 * 
	 * @param {string} message 
	 * @param {string} udid 
	 */
	constructor(message, udid) {
		super(message);
		this.udid = udid;
		this.name = 'LockdownPasswordProtectedError';
		this.code = native_lockdown_errors.LOCKDOWN_E_PASSWORD_PROTECTED;
	}
}

/**
 * Libimobiledevice lockdown error —device is not paired with this host.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {string} udid - Device udid.
 * @property {number} code - Error code.
 */
exports.LockdownInvalidHostIdError = class LockdownInvalidHostIdError extends Error {
	/**
	 * 
	 * @param {string} message 
	 * @param {string} udid 
	 */
	constructor(message, udid) {
		super(message);
		this.udid = udid;
		this.name = 'LockdownInvalidHostIdError';
		this.code = native_lockdown_errors.LOCKDOWN_E_INVALID_HOST_ID;
	}
}

/**
 * Libimobiledevice lockdown error —user must accept the trust dialog on the screen device, then attempt to pair again.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {string} udid - Device udid.
 * @property {number} code - Error code.
 */
exports.LockdownPairingDialongResponsoPendingError = class LockdownPairingDialongResponsoPendingError extends Error {
	/**
	 * 
	 * @param {string} message 
	 * @param {string} udid 
	 */
	constructor(message, udid) {
		super(message);
		this.udid = udid;
		this.name = 'LockdownPairingDialongResponsoPendingError';
		this.code = native_lockdown_errors.LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING;
	}
}

/**
 * Libimobiledevice lockdown error —user denied the trust dialog.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {string} udid - Device udid.
 * @property {number} code - Error code.
 */
exports.LockdownUserDeniedPairingError = class LockdownUserDeniedPairingError extends Error {
	/**
	 * 
	 * @param {string} message 
	 * @param {string} udid 
	 */
	constructor(message, udid) {
		super(message);
		this.udid = udid;
		this.name = 'LockdownUserDeniedPairingError';
		this.code = native_lockdown_errors.LOCKDOWN_E_USER_DENIED_PAIRING;
	}
}

/**
 * Libimobiledevice lockdown error.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {string} type - The different type of lockdown errors as string defined in native_lockdown_errors_dict
 * @property {number} code - The different code errors of lockdown as a number.
 */
exports.LockdownError = class LockdownError extends Error {
	/**
	 * 
	 * @param {string} message 
	 * @param {number} code 
	 */
    constructor(message, code) {
        super(message);
		this.name = 'LockdownError';
        this.type = native_lockdown_errors_dict[code];
        this.code = code;
    }
};

/**
 * Libimobiledevice idevice error. If this error is returned by info, pair or backup2 
 * methods means that no device has been found.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 * @property {number} code - Error code.
 */
exports.IdeviceNoDeviceFoundError = class IdeviceNoDeviceFoundError extends Error {
	/**
	 * 
	 * @param {string} message 
	 */
    constructor(message) {
        super(message);
		this.name = 'IdeviceNoDeviceFoundError';
        this.code = native_idevice_errors.IDEVICE_E_NO_DEVICE;
    }
}

/**
 * Error representing an unkown error generated by libimobiledevice.
 * @class
 * @constructor
 * @public
 * @property {string} name - Error name.
 */
exports.UnkownErrror = class UnkownError extends Error {
	/**
	 * 
	 * @param {string} message 
	 */
    constructor(message) {
        super(`Unkown error: ${message}`);
        this.name = 'UnkownErrror';
    }
};

exports.native_lockdown_errors = native_lockdown_errors;
exports.native_idevice_errors = native_idevice_errors;