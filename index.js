const cp = require('child_process');
const { idevice_id, CannotRetrieveDeviceListError, CannotMallocMemoryError, CannotReallocMemoryError } = require('./lib/idevice_id');
const { idevice_info, InfoInvalidDomainError, InfoUnkownError } = require('./lib/idevice_info');
const { UnkownErrror, IdeviceNoDeviceFoundError, LockdownPasswordProtectedError, LockdownInvalidHostIdError, LockdownPairingDialongResponsoPendingError, LockdownUserDeniedPairingError, LockdownError } = require('./lib/errors');
const { PairInvalidCommandError, PairUnkownError, idevice_pair, getPairParameters } = require('./lib/idevice_pair');
const { idevice_backup2, getBackup2Parameters, BACKUP2_COMMANDS, Backup2Error } = require('./lib/idevice_backup2');

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
// Backup errors
exports.Backup2Error = Backup2Error;

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

exports.backup2 = {
	/**
	 * backup –create backup for the device
	 * @param {{debug: boolean,
	 * udid: string,
	 * source: string,
	 * network: boolean,
	 * backup: { full: boolean },
	 * backup_directory: string
	 * }} options full flag will force full backup from device.
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: number) => void} progress 
	 */
	backup: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.backup, options, callback, progress);
		idevice_backup2(bOptions, bCallback, (progress) => bProgress(parseFloat(progress)));
	},
	/**
	 * restore –restore last backup to the device
	 * @param {{ debug: boolean,
	 * udid: string, 
	 * source: string,
	 * network: boolean,
	 * restore: { system: boolean, reboot: boolean, copy: boolean, settings: boolean, remove: boolean, skip_apps: boolean, password: string },
	 * interactive: boolean,
	 * backup_directory: string
	 * }} options 
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	restore: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.restore, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	},
	/**
	 * info –show details about last completed backup of device
	 * @param {{ debug: boolean, udid: string, source: string, network: boolean, backup_directory: string }} options 
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	info: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.info, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	},
	/**
	 * list –list files of last completed backup in CSV format
	 * @param {{ debug: boolean, udid: string, source: string, network: boolean, backup_directory: string }} options 
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	list: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.list, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	},
	/**
	 * unback –unpack a completed backup in DIRECTORY/_unback_/
	 * @param {{ debug: boolean, udid: string, source: string, network: boolean, backup_directory: string }} options 
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	 unback: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.unback, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	},
	/**
	 * encryption –enable or disable backup encryption
	 * @param {{ debug: boolean,
	 * udid: string, 
	 * source: string,
	 * network: boolean,
	 * encryption: { enable: boolean, password: string },
	 * interactive: boolean
	 * }} options encryption.enable flag must be set to true if you want to encrypt the device.
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	encryption: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.encryption, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	},
	/**
	 * changePassword —change backup password on target device
	 * @param {{ debug: boolean,
	 * udid: string, 
	 * source: string,
	 * network: boolean, 
	 * changepw: { backup_password: string, newpw: string },
	 * interactive: boolean
	 * }} options 
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	changePassword: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.changepw, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	},
	/**
	 * cloud –enable or disable cloud use (requires iCloud account)
	 * @param {{ debug: boolean, udid: string, source: string, network: boolean, cloud: { enable: boolean }, interactive: boolean}} options 
	 * @param {(error: Backup2Error, result: { success: boolean, message: string }) => void} callback 
	 * @param {(progress: string) => void} progress 
	 */
	cloud: (options, callback, progress) => {
		const { bOptions, bCallback, bProgress } = getBackup2Parameters(BACKUP2_COMMANDS.cloud, options, callback, progress);
		idevice_backup2(bOptions, bCallback, bProgress);
	}
}
