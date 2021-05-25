const imobiledevice = require('../index');


imobiledevice.pair.validate((error, info) => {
    console.error(`Error in callign ideviceinfo`, error);
    console.log(`pair validated with udid: ${info}`);
});