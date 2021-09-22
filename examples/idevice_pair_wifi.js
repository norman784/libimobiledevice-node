const imobiledevice = require('../index');

imobiledevice.pair.wifi({debug: false, udid: 'a4fa5cdfa9b4f43f490dae746a9adbb6af58aa09', wifioption: imobiledevice.WIFI_OPTIONS.on}, (error, state) => {
    if (error) {
        console.error(`Error in callign idevice_pair: `, error);
    } else {
        console.log(`idevicepair: ${state}`);
    }
});
