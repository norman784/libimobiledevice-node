#!/usr/bin/env python3
from shell import otool, get_relative_path, shell

class DylibFinder:

    def __init__(self, binary_path: str) -> None:
        self.dylibs = otool('-L', binary_path).splitlines()

    def get_dylib_path(self, name: str) -> str:
        for dylib in self.dylibs:
            strip_dylib = dylib.strip()
            endIndex = strip_dylib.find(name)
            if endIndex > -1:
                return strip_dylib[:endIndex] + name

def install_name_tool(library: str, loader_path: str, binary_path: str):
    shell(f'install_name_tool -change {library} {loader_path} {binary_path}')

if __name__ == "__main__":
    binary = get_relative_path('../build/Release/imobiledevice.node')
    dylibFinder = DylibFinder(binary)
    libplist = 'libplist-2.0.3.dylib'
    libusbmuxd='libusbmuxd-2.0.6.dylib'
    libimobiledevice='libimobiledevice-1.0.6.dylib'

    for library in [libplist, libusbmuxd, libimobiledevice]:
        old_library_path = dylibFinder.get_dylib_path(library)
        install_name_tool(old_library_path, f'@loader_path/../../dependencies/lib/{library}', binary)
