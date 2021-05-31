const imobiledevice = require('../index');

imobiledevice.backup2.encryption({ 
    network: true,
    encryption: {enable: true, password: '1234'}},
    (error, data) => {
    if (error) { console.error('encryption error: ', error); }
    else { console.log('encryption ', data) }
}, () => {});