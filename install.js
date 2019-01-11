
const shell = require('shelljs');
const os = require('os');


if (os.type() === 'Darwin' || os.type() === 'Linux')
{
  if(shell.exec('node-gyp rebuild').code !== 0) {
      shell.echo('Error: node-gyp failded');
      shell.exit(1);
  }

  if(shell.exec('sh postinstall.sh').code !== 0) {
    shell.echo('Error: postinstall.sh script failded');
    shell.exit(1);
 }
}
else if(os.type() === 'Windows_NT')
{
    if(shell.exec('install.cmd').code !== 0) {
        shell.echo('Error: install.cmd script failded');
        shell.exit(1);
    }
   
    if(shell.exec('node-gyp rebuild').code !== 0) {
        shell.echo('Error: node-gyp failded');
        shell.exit(1);
    }
  
    if(shell.exec('postinstall.cmd').code !== 0) {
      shell.echo('Error: postinstall.cmd script failded');
      shell.exit(1);
    }
}