const { stub } = require("sinon");

exports.initStubs = (cp) => {  
    return {
        fork: cp.fork = stub(),
        send: stub(),
        disconnect: stub()
    }
}

exports.initSpies = (stubs) => {
    return {
    child: {
        fork: stubs.fork,
        send: stubs.send,
        disconnect: stubs.disconnect
    }}
}

exports.stubChildOn = (error, devicelist) => (text, callback) => callback({error: error, data: devicelist});