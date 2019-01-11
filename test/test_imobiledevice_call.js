console.log("Looking for imobiledevice.node file in: ${__dirname}/../build/Release/")

const lib = require(`${__dirname}/../build/Release/imobiledevice`);

console.log("Imobiledevice.node has been found!")