## Node native add-on for libimobiledevice

![Main workflow](https://github.com/norman784/libimobiledevice-node/actions/workflows/main.yml/badge.svg)

The main focus of the library is with electron apps. More info in their official site [libimobiledevice.org](http://libimobiledevice.org)

## Installation

### Mac

```bash
$ yarn add libimobiledevice
```

### Windows

#### Requeriments

For using libimobiledevice-node on windows the following requeriments are needed:

- Install **Visual Studio 2017 community**.
- Install **Windows SDK 8.1**.
- Be sure **Powershell** command can be called from the command line.
- Add **msbuild.exe** on windows **PATH**.

```bash
$ yarn add libimobiledevice
```

## Todo

Binaries ported

- [x] idevice_id
- [ ] idevicebackup
- [x] idevicebackup2
- [ ] idevicecrashreport
- [ ] idevicedate
- [ ] idevicedebug
- [ ] idevicedebugserverproxy
- [ ] idevicediagnostics
- [ ] ideviceenterrecovery
- [ ] ideviceimagemounter
- [x] ideviceinfo
- [ ] idevicename
- [ ] idevicenotificationproxy
- [x] idevicepair
- [ ] ideviceprovision
- [ ] idevicescreenshot
- [ ] idevicesyslog

## Usage

```javascript
const lib = require('libimobiledevice')

// List of devices
lib.id(data => console.log(data))

// Device info
lib.info({
	debug: true,
    simple: true,
    udid: 'string',
    domain: 'string',
	key: 'string'
}, (err, data) => console.log(err, data))

// Device backup
// Warning this are all the options that the method could take,
// don't use all at the same time, check the library documentation
// for more info [libimobiledevice.org](http://libimobiledevice.org)
lib.backup2({
	debug: true,
    udid: 'string',
    source: 'string',
    backup: true,
    restore: true,
    system: true,
    reboot: true,
    copy: true,
    settings: true,
    remove: true,
    password: 'string',
    cloud: 'on|off'
    full: false,
    info: false,
    list: false,
    unback: false,
    encryption: {
    	status: 'on|off',
    	password: 'string'
	},
    changepw: {
    	newpw: 'string',
    	backup_password: 'string'
	},
    interactive: true,
    backup_directory: 'backup path'
}, (err, data) => console.log(err, data), progress => console.log(progress))
```

