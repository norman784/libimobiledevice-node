const imobiledevice = require('../index');
const homedir = require('os').homedir();

const backup_path = homedir + '/backuptemp/';

imobiledevice.backup2.backup({
    debug: true,
    network: false,
    backup_directory: backup_path
}, (error, data) => {
    if (error) { console.error('error: ', error); }
    else { console.log('backup ', data) }
}, (progressMessage) => {
    console.log(progressMessage);
});