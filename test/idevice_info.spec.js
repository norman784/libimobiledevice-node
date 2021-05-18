const { initStubs, initSpies, stubChildOn } = require('./helpers');
const cp = require('child_process');
const { native_lockdown_errors, native_idevice_errors } = require('../lib/errors');
const { native_idevice_info_errors } = require('../lib/idevice_info');
const { info, LockdownError, IdeviceNoDeviceFoundError, InfoInvalidDomainError, InfoUnkownError } = require('../index');
const { expect } = require('chai');

const batteryPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>BatteryCurrentCapacity</key>
	<integer>55</integer>
	<key>BatteryIsCharging</key>
	<false/>
	<key>ExternalChargeCapable</key>
	<true/>
	<key>ExternalConnected</key>
	<false/>
	<key>FullyCharged</key>
	<false/>
	<key>GasGaugeCapability</key>
	<true/>
	<key>HasBattery</key>
	<true/>
</dict>
</plist>
`


describe('idevice_info tests', () => {
    const expectedBatteryInfo = {
        BatteryCurrentCapacity: 55,
        BatteryIsCharging: false,
        ExternalChargeCapable: true,
        ExternalConnected: false,
        FullyCharged: false,
        GasGaugeCapability: true,
        HasBattery: true
    }
    const stubErrors = (infoError, ideviceError, lockdownError, message) => { return {infoError: infoError, ideviceError: ideviceError, lockdownError: lockdownError, errorMessage: message} }
    let stubs = {};
    let spies = {};

    beforeEach(() => {
        stubs = initStubs(cp);
        spies = initSpies(stubs);
    });

    it('info must retrieve information as an object', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_idevice_info_errors.INFO_E_ESUCCESS,
                    native_idevice_errors.IDEVICE_E_SUCCESS, 
                    native_lockdown_errors.LOCKDOWN_E_SUCCESS, 
                    ''
                ), 
                batteryPlist),
            disconnect: spyDisconnect.returns(() => {})
        });

        info({}, (error, info) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.null;
            expect(info).to.eql(expectedBatteryInfo);
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('info must retrieve information as an object if options is not defined', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                native_idevice_info_errors.INFO_E_ESUCCESS,
                native_idevice_errors.IDEVICE_E_SUCCESS,
                native_lockdown_errors.LOCKDOWN_E_SUCCESS, 
                ''
            ),
                batteryPlist),
            disconnect: spyDisconnect.returns(() => {})
        });

        info((error, info) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.null;
            expect(info).to.eql(expectedBatteryInfo);
        });

        expect(spyDisconnect.called).to.equal(true);
    });


    it('info must return error if device is not found', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_idevice_info_errors.INFO_E_UNKOWN_ERROR,
                    native_idevice_errors.IDEVICE_E_NO_DEVICE,
                    native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR, 
                    ''
                ), 
                batteryPlist),
            disconnect: spyDisconnect.returns(() => {})
        });

        info({}, (error, info) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(IdeviceNoDeviceFoundError);
            expect(info).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('info must return error if invalid domain is provided', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                    native_idevice_info_errors.INFO_E_INVALID_DOMAIN,
                    native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR,
                    native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR,
                    ''
                ), 
                batteryPlist),
            disconnect: spyDisconnect.returns(() => {})
        });

        info({}, (error, info) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(InfoInvalidDomainError);
            expect(info).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('info must return error if imobiledevice lockdown fails', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                native_idevice_info_errors.INFO_E_UNKOWN_ERROR,
                native_idevice_errors.IDEVICE_E_SUCCESS,
                native_lockdown_errors.LOCKDOWN_E_INVALID_SERVICE, ''), 
                batteryPlist),
            disconnect: spyDisconnect.returns(() => {})
        });

        info({}, (error, info) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(LockdownError);
            expect(info).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

    it('info must return an unkown error', () => {
        const spySend = spies.child.send;
        const spyDisconnect = spies.child.disconnect;
        const spyFork = spies.child.fork.returns({
            send: spySend.returns((options) => {}),
            on: stubChildOn(stubErrors(
                native_idevice_info_errors.INFO_E_UNKOWN_ERROR,
                native_idevice_errors.IDEVICE_E_UNKNOWN_ERROR,
                native_lockdown_errors.LOCKDOWN_E_UNKNOWN_ERROR, 
                ''), 
                batteryPlist),
            disconnect: spyDisconnect.returns(() => {})
        });

        info({}, (error, info) => {
            expect(spyFork.called).to.equal(true);
            expect(spySend.called).to.equal(true);
            expect(error).to.be.instanceOf(InfoUnkownError);
    
            expect(info).to.be.null;
        });

        expect(spyDisconnect.called).to.equal(true);
    });

});