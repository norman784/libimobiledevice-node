const spawn = require('child_process').spawn;
const os = require('os');

if (os.type() === 'Darwin' || os.type() === 'Linux')
{
    let macInstaller = spawn('sh', ['install.sh']);
    macInstaller.stdout.on('data',(data) => {
        console.log(data.toString());
    });
    macInstaller.stderr.on('data', (data) => {
        console.log(data.toString());
    });
    macInstaller.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
}
else if(os.type() === 'Windows_NT')
{
    let windowsInstaller = spawn('cmd.exe', ['/c','preinstall.cmd']);
    windowsInstaller.stdout.on('data',(data) => {
        console.log(data.toString());
    });
    windowsInstaller.stderr.on('data', (data) => {
        console.log(data.toString());
    });
    windowsInstaller.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
}