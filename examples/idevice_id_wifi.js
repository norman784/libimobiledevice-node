const imobiledevice = require('../index');

var counter = 0;
setInterval(() => {
    imobiledevice.id({debug: false, usblist: false, networklist: true}, (error, info) => {
        if (error) {
            console.error(`Error in callign idevice id: ${error}`);
        } else {
            if (info.networklist.length > 0) {
                counter++;
            }
            console.log('idevice id: ', info);
            console.log('counter: ', counter);
        }
    });
}, 5000);



