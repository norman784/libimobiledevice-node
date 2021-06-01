const imobiledevice = require('../index');

imobiledevice.backup2.encryption({ 
    network: false,
    encryption: {enable: false, password: '1234'}},
    (error, data) => {
    if (error) { console.error('encryption error: ', error); }
    else { console.log('encryption ', data) }
}, () => {});