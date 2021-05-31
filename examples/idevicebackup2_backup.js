const imobiledevice = require('../index');
const homedir = require('os').homedir();

const backup_path = homedir + '/backuptemp';

const parseProgress = (progressMessage) => {
    const regex = /\d+/g
    const progressMatch = progressMessage.match(regex);
    return progressMatch ? parseInt(progressMatch[0], 10) : 0;
}

function printProgress(progress){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress + '% - ');
}

imobiledevice.backup2.backup({
    network: true,
    debug: true,
    backup_directory: backup_path
}, (error, data) => {
    if (error) { console.error('error: ', error); }
    else { console.log('backup ', data) }
}, (progressMessage) => {
    progress = parseProgress(progressMessage);
    printProgress(progress);
});