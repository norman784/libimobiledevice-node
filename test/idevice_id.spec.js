
const { id } = require('../index');
const cp = require('child_process');
const { expect } = require('chai');
const { 
    UnkownErrror,
    CannotRetrieveDeviceListError,
    CannotMallocMemoryError,
    CannotReallocMemoryError } = require('../index');
const { native_id_errors } = require('../lib/idevice_id');
const { initSpies, initStubs, stubChildOn } = require('./helpers');


describe('Test idevice_id', () => {

    const stubDeviceList = {usblist: ['abcdef1234566'], networklist: ['1234566abcdef']};

    let stubs = {};
    let spies = {};
  
    beforeEach(() => {
        stubs = initStubs(cp);
        spies = initSpies(stubs);
    });

    it('id retrieve the list successfully', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(native_id_errors.ID_E_SUCCESS, stubDeviceList),
            disconnect: spyDisconnect.returns(() => {})
        });

        id({}, (error, devicelist) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.equal(0);
            expect(devicelist).to.equal(stubDeviceList);
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id calls child send with the correct options', () => {
        const options = {debug: false, usblist: true, networklist: true };
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend,
            on: stubChildOn(native_id_errors.ID_E_SUCCESS, {}),
            disconnect: spyDisconnect
        });

        id(options, (error, devicelist) => {
            expect(spySend.calledWith(options)).to.equal(true);
        });

    });

    it('id does not have defined options, should return successfully', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend,
            on: stubChildOn(native_id_errors.ID_E_SUCCESS, stubDeviceList),
            disconnect: spyDisconnect
        });

        id((error, devicelist) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.equal(0);
            expect(devicelist).to.equal(stubDeviceList);
        });

    });

    it('id can not retrieve the list of devices', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend,
            on: stubChildOn(native_id_errors.ID_E_CANNOT_RETRIEVE_DEVICE_LIST, null),
            disconnect: spyDisconnect
        });

        id({}, (error, devicelist) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.an.instanceOf(CannotRetrieveDeviceListError);
            expect(devicelist).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id fails malloc memory', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend,
            on: stubChildOn(native_id_errors.ID_E_CANNOT_MALLOC_MEMORY, null),
            disconnect: spyDisconnect
        });

        id({}, (error, devicelist) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.an.instanceOf(CannotMallocMemoryError);
            expect(devicelist).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id fails realloc memory', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend,
            on: stubChildOn(native_id_errors.ID_E_CANNOT_REALLOC_MEMORY, null),
            disconnect: spyDisconnect
        });

        id({}, (error, devicelist) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.an.instanceOf(CannotReallocMemoryError);
            expect(devicelist).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id fails for an unkown error', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend,
            on: stubChildOn(-100, null),
            disconnect: spyDisconnect
        });

        id({}, (error, devicelist) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.an.instanceOf(UnkownErrror);
            expect(devicelist).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

});