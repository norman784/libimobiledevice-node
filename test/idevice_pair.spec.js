const { initStubs, initSpies, stubChildOn } = require('./helpers');
const cp = require('child_process');
const { native_lockdown_errors, native_idevice_errors } = require('../lib/errors');
const { pair, IdeviceNoDeviceFoundError, LockdownUserDeniedPairingError, LockdownPasswordProtectedError, LockdownInvalidHostIdError, LockdownPairingDialongResponsoPendingError, LockdownError } = require('../index');
const { expect } = require('chai');
const { native_pair_errors, PairInvalidCommandError, PairUnkownError, idevice_pair } = require('../lib/idevice_pair');
const { match } = require("sinon");

describe('idevice_pair tests', () => {

    const stubErrors = (pairError, ideviceError, lockdownError, message) => { return {pairError: pairError, ideviceError: ideviceError, lockdownError: lockdownError, errorMessage: message} };
    const defaultForkStub = (spies) => {return {
        send: spies.child.send.returns((options) => {}),
        on: stubChildOn(stubErrors(0, 0, 0, ''),''),
        disconnect: spies.child.disconnect.returns(() => {})
    }};
    let getDefaultOptions = (command) => {return {debug: false, command: command, udid: null}; };
    let stubs = {};
    let spies = {};

    beforeEach(() => {
        stubs = initStubs(cp);
        spies = initSpies(stubs);
    });

    it('id.pair.pair must be called with pair option', () => {
        let expectedOptions = getDefaultOptions('pair');
        const spySend = spies.child.send;
        spies.child.fork.returns(defaultForkStub(spies));
        pair.pair(expectedOptions, (error, udid) => {
            expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
        });
    });

    it('id.pair.validate must be called with validate option', () => {
        let expectedOptions = getDefaultOptions('validate');
        const spySend = spies.child.send;
        spies.child.fork.returns(defaultForkStub(spies));
        pair.validate(expectedOptions, (error, udid) => {
            expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
        });
    });

    it('id.pair.unpair must be called with unpair option', () => {
        let expectedOptions = getDefaultOptions('unpair');
        const spySend = spies.child.send;
        spies.child.fork.returns(defaultForkStub(spies));
        pair.unpair(expectedOptions, (error, udid) => {
            expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
        });
    });

    it('id.pair.list must be called with list option', () => {
        let expectedOptions = getDefaultOptions('list');
        const spySend = spies.child.send;
        spies.child.fork.returns(defaultForkStub(spies));
        pair.list(expectedOptions, (error, udid) => {
            expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
        });
    });

    it('id.pair.systembuid must be called with systembuid option', () => {
        let expectedOptions = getDefaultOptions('systembuid');
        const spySend = spies.child.send;
        spies.child.fork.returns(defaultForkStub(spies));
        pair.systembuid(expectedOptions, (error, udid) => {
            expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
        });
    });

    it('id.pair.hostid must be called with hostid option', () => {
        let expectedOptions = getDefaultOptions('hostid');
        const spySend = spies.child.send;
        spies.child.fork.returns(defaultForkStub(spies));
        pair.hostid(expectedOptions, (error, udid) => {
            expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
        });
    });

    it('id.pair.pair must pair successfully.', () => {
        const expectedUdid = '00008020-000130543C46001F';
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                native_pair_errors.PAIR_E_SUCCESS,
                native_idevice_errors.IDEVICE_E_SUCCESS,
                native_lockdown_errors.LOCKDOWN_E_SUCCESS, 
                ''
            ),
            expectedUdid),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({debug: false, udid: expectedUdid}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.null;
            expect(udid).to.eql(expectedUdid);
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair.systembuid must run successfully.', () => {
        const expectedSystembuid = '3A622A81-12F1-7348-EFB9-465774D2348B';
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                native_pair_errors.PAIR_E_SUCCESS,
                native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR,
                native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR, 
                ''
            ),
            expectedSystembuid),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.systembuid((error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.null;
            expect(udid).to.eql(expectedSystembuid);
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair.hostid must run successfully.', () => {
        const expectedHostid = '143A2E7E-AF31-D2E3-2446-41F4EF34EC2A';
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                native_pair_errors.PAIR_E_SUCCESS,
                native_idevice_errors.IDEVICE_E_SUCCESS,
                native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR, 
                ''
            ),
            expectedHostid),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.hostid((error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.null;
            expect(udid).to.eql(expectedHostid);
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with invalid command', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_INVALID_COMMAND,
                    native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR,
                    native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(PairInvalidCommandError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with device not found', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_NO_DEVICE,
                    native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(IdeviceNoDeviceFoundError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with device is password protected', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_SUCCESS,
                    native_lockdown_errors.LOCKDOWN_E_PASSWORD_PROTECTED, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(LockdownPasswordProtectedError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with invalid host id', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_SUCCESS,
                    native_lockdown_errors.LOCKDOWN_E_INVALID_HOST_ID, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(LockdownInvalidHostIdError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with pending pairing dialog response', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_SUCCESS,
                    native_lockdown_errors.LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(LockdownPairingDialongResponsoPendingError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with user denied pairing', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_SUCCESS,
                    native_lockdown_errors.LOCKDOWN_E_USER_DENIED_PAIRING, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(LockdownUserDeniedPairingError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with lockdown error', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR,
                    native_lockdown_errors.LOCKDOWN_E_INVALID_CONF, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(LockdownError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('id.pair must fail with pair unknown error', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_pair_errors.PAIR_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_TIMEOUT,
                    native_lockdown_errors.LOCKDOWN_E_INVALID_CONF, 
                    ''
                ), 
                null),
            disconnect: spyDisconnect.returns(() => {})
        });

        pair.pair({}, (error, udid) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(PairUnkownError);
            expect(udid).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });
});