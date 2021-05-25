const imobiledevice = require('../index');


imobiledevice.pair.pair({udid: '00008020-00536054332632021'}, (error, info) => {
    console.error(`Error in callign idevice_pair: `, error);
    console.log(`idevicepair: ${info}`);
});