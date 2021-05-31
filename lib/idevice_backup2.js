const cp = require('child_process');

const getDefaultBackup = (backup) => { return { full: backup?.full || false } };
const getDefaultRestore = (restore) => {
    return {
        system: restore?.system || false,
        reboot: restore?.reboot || true,
        copy: restore?.copy || false,
        settings: restore?.settings || false,
        remove: restore?.remove || true,
        skip_apps: restore?.skip_apps || false,
        password: restore?.password || null
    }
}
const getDefaultEncryption = (encryption) => { return {
    enable: encryption?.enable || false,
    password: encryption?.password || null
}};
const getDefaultChangepw = (changepw) => { return {
    backup_password: changepw?.backup_password || null,
    newpw: changepw?.newpw || null
}};
const getDefaultCloud = (cloud) => { return { enable: cloud?.enable || false }};

const getDefaultOptions = (command, options) => {
    let bOptions = {
        debug: false,
        udid: null,
        source: null,
        network: false,
        command: command,
        backup: getDefaultBackup(),
        restore: getDefaultRestore(),
        encryption: getDefaultEncryption(),
        changepw: getDefaultChangepw(),
        cloud: getDefaultCloud(),
        interactive: false,
        backup_directory: null
    }
    if(options) {
        bOptions.debug = options.debug || false;
        bOptions.udid = options.udid || null;
        bOptions.source = options.source || null;
        bOptions.network = options.network || false;
        bOptions.command = command || null;
        if (options.backup) {
            bOptions.backup = getDefaultBackup(options.backup);
        }
        if (options.restore) {
            bOptions.restore = getDefaultRestore(options.restore);
        }
        if (options.encryption) {
            bOptions.encryption = getDefaultEncryption(options.encryption);
        }
        if (options.changepw) {
            bOptions.changepw = getDefaultChangepw(options.changepw);
        }
        if (options.cloud) {
            bOptions.cloud = getDefaultCloud(options.cloud);
        }
        bOptions.interactive = options.interactive || false;
        bOptions.backup_directory = options.backup_directory || null;
    }
    return bOptions;
}
const getBackup2Parameters = (command, options, callback, progress) => {
    if (typeof options === 'function') {
		if (typeof callback === 'function') progress = callback
		callback = options
		options = null
	}
	options = getDefaultOptions(command, options);
    return {bOptions: options, bCallback: callback, bProgress: progress }
}

/**
 * Enum BACKUP2_COMMANDS
 * @enum {string}
 */
const BACKUP2_COMMANDS = {
    backup: 'backup',
    restore: 'restore',
    info: 'info',
    list: 'list',
    unback: 'unback',
    encryption: 'encryption',
    changepw: 'changepw',
    cloud: 'cloud'
}

exports.getDefaultOptions = getDefaultOptions;
exports.getBackup2Parameters = getBackup2Parameters;
exports.BACKUP2_COMMANDS = BACKUP2_COMMANDS;

/**
 * 
 * @param {{
 * debug: boolean,
 * udid: string,
 * source: string,
 * network: boolean,
 * command: BACKUP2_COMMANDS,
 * backup: { full: boolean },
 * restore: { system: boolean, reboot: boolean, copy: boolean, settings: boolean, remove: boolean, skip_apps: boolean, password: string },
 * encryption: { enable: boolean, password: string },
 * changepw: { backup_password: string, newpw: string },
 * cloud: { enable: boolean },
 * interactive: boolean,
 * backup_directory: string
 * }} options 
 * @param {(error: string, data: string) => void} callback 
 * @param {(progress: string) => void} progress 
 * @returns
 */
exports.idevice_backup2 = function(options, callback, progress) {
    const child = cp.fork(`${__dirname}/workers/backup2_worker`);
    child.send(options);
    child.on('message', res => {
        if (res.progress) progress(res.progress);
        else {
            callback(res.error, res.data);
            child.disconnect();
        }
    })
    return child;
}