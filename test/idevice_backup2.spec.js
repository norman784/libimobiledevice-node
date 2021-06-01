const { stubChildOn, initStubs, initSpies } = require("./helpers");
const { backup2 } = require('../index');
const { expect } = require("chai");
const cp = require('child_process');
const { match } = require("sinon");
const { getDefaultOptions, BACKUP2_COMMANDS, Backup2Error } = require("../lib/idevice_backup2");

describe('idevice_backup2 tests', () => {
    const path = 'Users/homedir';
    const getStubChildOn = (error, data, progress) => (text, callback) => callback({error: error, data: data, progress: progress});
    const stubFork = (spies, error, success, progress) => {
        return {
            send: spies.child.send.returns((options) => {}),
            on: getStubChildOn(error || null, success || '', progress),
            disconnect: spies.child.disconnect.returns(() => {})
        };
    }
    const progress = (progress) => progress;
    let spySend;
    let stubs = {};
    let spies = {};

    beforeEach(() => {
        stubs = initStubs(cp);
        spies = initSpies(stubs);
        spySend = spies.child.send;
    })

    it('id.backup2.backup must be called with backup command', () => {
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.backup, {backup_directory: path});
        spies.child.fork.returns(stubFork(spies));
        backup2.backup({ backup_directory: path }, 
            () => {
                expect(spySend.calledWith(match(expectedOptions))).to.equal(true);
            }, progress
        );
    });

    it('id.backup2.restore must be called with restore command', () => {
        let options = { restore: { system: true, copy: true, reboot: true}, backup_directory: path };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.restore, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.restore(options, () => { expect(spySend.calledWith(match(expectedOptions))).to.equal(true); }, progress);
    });

    it('id.backup2.info must be called with info command', () => {
        let options = { backup_directory: path };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.info, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.info(options, () => { expect(spySend.calledWith(match(expectedOptions))).to.equal(true); }, progress);
    });

    it('id.backup2.list must be called with list command', () => {
        let options = { backup_directory: path };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.list, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.list(options, () => { expect(spySend.calledWith(match(expectedOptions))).to.equal(true); }, progress);
    });

    it('id.backup2.unback must be called with unback command', () => {
        let options = { backup_directory: path };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.unback, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.unback(options, () => { expect(spySend.calledWith(match(expectedOptions))).to.equal(true); }, progress);
    });

    it('id.backup2.encryption must be called with encryption command', () => {
        let options = { encryption: { enable: true, password: '1234' } };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.encryption, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.encryption(options, () => {expect(spySend.calledWith(match(expectedOptions))).to.equal(true); }, progress);
    });

    it('id.backup2.changePassword must be called with changepw command', () => {
        let options = { changepw: { backup_password: '1234', newpw: '4321' } };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.changepw, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.changePassword(options, () => { expect(spySend.calledWith(match(expectedOptions))).to.equal(true); }, progress);
    });

    it('id.backup2.cloud must be called with cloud command', () => {
        let options = { cloud: { enable: true } };
        let expectedOptions = getDefaultOptions(BACKUP2_COMMANDS.cloud, options);
        spies.child.fork.returns(stubFork(spies));
        backup2.cloud(options, () => { expect(spySend.calledWith(match(expectedOptions))).to.equal(true);}, progress);
    });

    it('id.backup2.backup should return success if there is multiple messages', () => {
        let options = { backup_directory: path };
        let message = 'Backup Started\nBackup successfully done\nSUCCESS';
        spies.child.fork.returns(stubFork(spies, '', message));
        let progress = (progress) => {};
        backup2.backup(options, (error, result) => {
            let expectedResult = { success: true, message: message };
            expect(result).to.eql(expectedResult);
            expect(error).to.be.null;
        }, progress);
    });

    it('id.backup2.backup should return a float', () => {
        let options = { backup_directory: path };
        let message = 'SUCCESS';
        spies.child.fork.returns(stubFork(spies, '', message, progress('10.12')));
        backup2.backup(options, (error, result) => {
            expect(result).to.eql({ success: true, message: message});
            expect(error).to.be.null;
        }, (progress) => {
            expect(progress).to.eql(10.12);
        });
    });

    it('id.backup2.backup should fail with Backup2Error', () => {
        let options = { backup_directory: path };
        let message = 'SUCCESS';
        spies.child.fork.returns(stubFork(spies, 'ERROR: BACKUP', null, null));
        backup2.backup(options, (error, result) => {
            expect(result).to.be.null;
            expect(error).to.be.instanceOf(Backup2Error);
        }, () => {});
    });
    
});