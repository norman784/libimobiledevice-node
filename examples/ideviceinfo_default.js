const imobiledevice = require('../index');


imobiledevice.info({}, (error, info) => {
    if (error) {
        console.error(`Error in callign ideviceinfo: ${error}`);
    } else {
        console.log(`ideviceinfo: ${info}`);
    }
});