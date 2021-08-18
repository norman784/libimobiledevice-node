#!/usr/bin/env python
from __future__ import unicode_literals
import os
from posix import environ
import subprocess
import re
import glob
import shutil

ROOT_PATH = os.getcwd()
INSTALL_DIR = f'{ROOT_PATH}/dependencies'
TMP_PATH = f'{ROOT_PATH}/tmp'

OPENSSL_URL =' https://www.openssl.org/source/openssl-1.1.1k.tar.gz'
OPENSSL_CHECK_FILE = f'{INSTALL_DIR}/include/openssl/opensslv.h'

LIBPLIST_URL = 'https://github.com/libimobiledevice/libplist.git'
LIBPLIST_COMMIT = 'feb0bcd'

LIBUSBMUXD_URL = 'https://github.com/libimobiledevice/libusbmuxd.git'
LIBUSBMUXD_COMMIT = 'e32bf76'

LIBIMOBILEDEVICE_URL = 'https://github.com/libimobiledevice/libimobiledevice.git'
LIBIMOBILEDEVICE_COMMIT = 'ca324155f8b33babf907704828c7903608db0aa2'


def get_title(name: str) -> str:
    return f"""
                Install {name}
    -------------------------------------------


    """


def get_install_successfully(name: str) -> str:
    return f"""
            🥳 {name} installed successfully
    """


def shell(command: str, cwd: str = None, check=True, env = None):
    subprocess.run(command, cwd=cwd, shell=True, check=check, env=env)


def make(arg: str = None, cwd: str = None, env = None):
    if arg:
        shell(f'make {arg}', cwd=cwd, env=env)
    else:
        shell('make', cwd=cwd, env=env)


def exit_with_error(error: str):
    print(error)
    exit(1)


def uname(option: str):
    return subprocess.run(["uname", option], capture_output=True, text=True).stdout.strip()


def configure_openssl(prefix:str, arch: str, openssl_dir: str = None) -> str:
    if openssl_dir:
        return f"./Configure --prefix={prefix} --openssldir={openssl_dir} {arch}"
    else:
        return f"./Configure --prefix={prefix} {arch}"


def get_openssl_configuration() -> str:
    operating_system = uname('-s')

    if operating_system == 'Darwin':
        arch = uname('-m')
        if arch == 'x86_64':
            print('\n\n ------- Compiling Openssl with Darwin Intel ------- \n\n')
            return configure_openssl(prefix=INSTALL_DIR, openssl_dir=f'{INSTALL_DIR}/openssl', arch='darwin64-x86_64-cc')
        elif arch == 'arm64':
            print('\n\n ------- Compiling Openssl with Darwin Apple Silicon ------- \n\n')
            return configure_openssl(prefix=INSTALL_DIR, arch='darwin64-arm64-cc')
        else:
            exit_with_error('\n\n ------- Invalid architecture found  ------- \n\n')
    elif operating_system.find('CYGWIN') > -1:
        exit_with_error('\n\n ------- Openssl CYGWIN configuration not defined yet  ------- \n\n')
    else:
        exit_with_error('\n\n ------- No suitable compiler has been found  ------- \n\n')


def install_openssl_ifneeded():
    if os.path.isfile(OPENSSL_CHECK_FILE):
        return

    print(get_title('openssl'))

    openssl_tar_file = re.search('openssl-.*', OPENSSL_URL)[0]
    openssl_dir = f"{TMP_PATH}/{openssl_tar_file.replace('.tar.gz', '').strip()}"
    shell(f'curl -OL {OPENSSL_URL}', cwd=TMP_PATH)
    shell(f'tar xvzf {openssl_tar_file}', cwd=TMP_PATH)
    shell(get_openssl_configuration(), cwd=openssl_dir)

    make(cwd=openssl_dir)
    make('install_sw', cwd=openssl_dir)

    print(get_install_successfully('openssl'))


def install_lib_ifneeded(name: str, url: str, commit: str, is_pkg_config: bool = False, is_ld_library: bool = False, is_cdpath: bool = False):
    
    if glob.glob(f'{INSTALL_DIR}/lib/{name}-*.dylib'):
        return

    print(get_title(name))
    lib_dir = f'{TMP_PATH}/{name}'

    shell(f'git clone {url} {name}', cwd=TMP_PATH)
    shell(f'git checkout {commit}', cwd=lib_dir)

    environment = os.environ.copy()
    if is_pkg_config:
        environment['PKG_CONFIG_PATH'] = f'{INSTALL_DIR}/lib/pkgconfig'
    if is_ld_library:
        environment['LD_LIBRARY_PATH'] = f'{INSTALL_DIR}/lib'
    if is_cdpath:
        environment['CPATH'] = f'{INSTALL_DIR}/include/openssl'

    # for some reason the first time it set the libtool folter to ../.. instead of .
    # so running a second time the issue its fixed
    shell('./autogen.sh', cwd=lib_dir, check=False, env=environment)
    shell('./autogen.sh', cwd=lib_dir, env=environment)
    shell(f'./configure --prefix={INSTALL_DIR} --without-cython', cwd=lib_dir, env=environment)
    make(cwd=lib_dir, env=environment)
    make('install', cwd=lib_dir, env=environment)

    ltmain = 'ltmain.sh'
    if os.path.isfile(ltmain):
        os.remove(ltmain)

    print(get_install_successfully(name))


def install_name_tool(option: str, library: str, binary_or_library: str):
    library_dir=f'{INSTALL_DIR}/lib'
    shell(f'install_name_tool {option} {library_dir}/{library} @loader_path/{library} {library_dir}/{binary_or_library}')


def change_dylib_path_to_relative():
    libssl='libssl.1.1.dylib'
    libcrypto='libcrypto.1.1.dylib'
    libplist='libplist-2.0.3.dylib'
    libusbmuxd='libusbmuxd-2.0.6.dylib'
    libimobiledevice='libimobiledevice-1.0.6.dylib'

    print("""
       Change absolute path to relative path
    -------------------------------------------
    """)

    print(f'✅ {libssl}\n')
    install_name_tool('-change', libcrypto, libssl)

    print(f'✅ {libusbmuxd}\n')
    install_name_tool('-change', libplist, libusbmuxd)

    print(f'✅ {libimobiledevice}\n')
    for library in [libssl, libcrypto, libplist, libusbmuxd]:
        install_name_tool('-change', library, libimobiledevice)


# Main
if not os.path.isdir(TMP_PATH):
    os.mkdir(TMP_PATH)

# Install Openssl
install_openssl_ifneeded()

# Install libimobledevice tools and library
install_lib_ifneeded('libplist', LIBPLIST_URL, LIBPLIST_COMMIT)
install_lib_ifneeded('libusbmuxd', LIBUSBMUXD_URL, LIBUSBMUXD_COMMIT, is_pkg_config=True)
install_lib_ifneeded('libimobiledevice', LIBIMOBILEDEVICE_URL, LIBIMOBILEDEVICE_COMMIT, is_pkg_config=True, is_ld_library=True, is_cdpath=True)

if os.path.isdir(TMP_PATH):
    shutil.rmtree(TMP_PATH)

if os.path.isdir(f'{INSTALL_DIR}/bin'):
    shutil.rmtree(f'{INSTALL_DIR}/bin')

if uname('-s') == "Darwin":
    change_dylib_path_to_relative()

