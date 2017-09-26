#!/bin/sh

INSTALL_PATH=$1

echo ""
echo "Link to libimobiledevice.6.dylib, libusbmuxd.4.dylib,  libplist.3.dylib"
echo "-------------------------------------------"

echo "[✔] libimobiledevice.6.dylib"
install_name_tool -change $INSTALL_PATH/lib/libusbmuxd.4.dylib @loader_path/libusbmuxd.4.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib
install_name_tool -change $INSTALL_PATH/lib/libplist.3.dylib @loader_path/libplist.3.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib

echo "[✔] libusbmuxd.4.dylib"
install_name_tool -change $INSTALL_PATH/lib/libplist.3.dylib @loader_path/libplist.3.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib
