const imobiledevice = require('../index');

imobiledevice.id({debug: false, usblist: true, networklist: false}, (error, info) => {
    if (error) {
        console.error(`Error in callign idevice id: ${error}`);
    } else {
        console.log('idevice id: ', info);
    }
});