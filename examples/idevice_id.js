const imobiledevice = require('../index');

imobiledevice.id({debug: true, usblist: false, networklist: true}, (error, info) => {
    if (error) {
        console.error(`Error in callign idevice id: ${error}`);
    } else {
        console.log('idevice id: ', info);
    }
});