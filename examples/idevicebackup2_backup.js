const imobiledevice = require('../index');
const homedir = require('os').homedir();

const backup_path = homedir + '/backuptemp/';

imobiledevice.backup2.backup({
    debug: true,
    network: true,
    udid: '199d80698a9a5583b0577f157838861a9d878993',
    backup_directory: backup_path
}, (error, data) => {
   console.log('------------------- error -------------------');
   console.log(error);
   console.log('------------------- data -------------------');
   console.log(data);
}, (progressMessage) => {
    console.log(progressMessage);
});
