const cp = require('child_process');
const { UnkownErrror } = require('./errors');

const native_id_errors = {
    ID_E_SUCCESS: 0,
    ID_E_CANNOT_RETRIEVE_DEVICE_LIST: -1,
    ID_E_CANNOT_MALLOC_MEMORY: -2,
    ID_E_CANNOT_REALLOC_MEMORY: -3
}

/**
 * Error representing that any divice has been found.
 * @class
 * @constructor
 * @public
 * @property {string} name
 * @property {number} code
 */
class CannotRetrieveDeviceListError extends Error {
    constructor() {
        super("ERROR: Cannot retrieve device list");
        this.name = 'CannotRetrieveDeviceListError';
        this.code = native_id_errors.ID_E_CANNOT_RETRIEVE_DEVICE_LIST;
    }
}

/**
 * Error representing a memory error from libimobiledevice which can't alloc memory.
 * @class
 * @constructor
 * @public
 * @property {string} name
 * @property {number} code
 */
class CannotMallocMemoryError extends Error {
    constructor() {
        super("ERROR: Cannot malloc memory");
        this.name = 'CannotMallocMemoryError';
        this.code = native_id_errors.ID_E_CANNOT_MALLOC_MEMORY;
    }
}

/**
 * Error representing a memory error from libimobiledevice which can't realloc memory.
 * @class
 * @constructor
 * @public
 * @property {string} name
 * @property {number} code
 */
class CannotReallocMemoryError extends Error {
    constructor() {
        super("ERROR: Cannot realloc memory");
        this.name = 'CannotReallocMemoryError';
        this.code = native_id_errors.ID_E_CANNOT_REALLOC_MEMORY;
    }
}

exports.idevice_id = function(options, callback) {
	if (typeof options === "function") {
		callback = options;
		options = null;
	}

    options = options || {};

    const child = cp.fork(`${__dirname}/workers/id_worker`);
    child.send(options);
    child.on('message', res => {
        switch(res.error) {
            case native_id_errors.ID_E_SUCCESS:
                callback(res.error, res.data);
                break;
            case native_id_errors.ID_E_CANNOT_RETRIEVE_DEVICE_LIST:
                callback(new CannotRetrieveDeviceListError(), null);
                break;
            case native_id_errors.ID_E_CANNOT_MALLOC_MEMORY:
                callback(new CannotMallocMemoryError(), null);
                break;
            case native_id_errors.ID_E_CANNOT_REALLOC_MEMORY:
                callback(new CannotReallocMemoryError(), null);
                break;
            default:
                callback(new UnkownErrror(res.error), null);
                break;
        }
        child.disconnect();
    });
    return child;
}

exports.CannotRetrieveDeviceListError = CannotRetrieveDeviceListError;
exports.CannotMallocMemoryError = CannotMallocMemoryError;
exports.CannotReallocMemoryError = CannotReallocMemoryError;
exports.native_id_errors = native_id_errors;