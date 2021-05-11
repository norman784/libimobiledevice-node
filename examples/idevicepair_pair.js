const imobiledevice = require('../index');


imobiledevice.pair("pair", (error, info) => {
    if (error) {
        console.error(`Error in callign ideviceinfo: ${error}`);
    } else {
        console.log(`idevicepair: ${info}`);
    }
});