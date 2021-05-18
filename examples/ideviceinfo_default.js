const imobiledevice = require('../index');


imobiledevice.info({}, (error, info) => {
    console.error('Error in callign ideviceinfo: ', error);
    console.log('ideviceinfo: ', info);
});