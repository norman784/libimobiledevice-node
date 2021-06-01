const imobiledevice = require('../index');

imobiledevice.backup2.checkPassword({ network: false, backup_password: '12345' },
    (error, data) => {
    if (error) { console.error('encryption error: ', error); }
    else { console.log('checked') }
}, (progress) => { console.log('put pin code?', progress); });