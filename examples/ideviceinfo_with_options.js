const imobiledevice = require('../index');

imobiledevice.info({
    debug: true,
    domain: "com.apple.mobile.battery",
    network: true
}, (error, info) => {
    if(error) {
        console.error('Error in callign ideviceinfo: ', error);
    } else {
        console.log('ideviceinfo: ', info);
    }
});