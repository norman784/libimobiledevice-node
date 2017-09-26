const lib = require('../index')

console.log('idevice_backup2 start')
lib.idevice_backup2({
    backup: true,
    debug: true,
    udid: '77313c2d83f9eebde67a0946bf473cef9b5d4b8a',
    backup_directory: '/Users/normanpaniagua/Library/Application\ Support/Keepster/backups/77313c2d83f9eebde67a0946bf473cef9b5d4b8a'
}, (err, data) => console.log('end', err, data), data => console.log('progress', data))
