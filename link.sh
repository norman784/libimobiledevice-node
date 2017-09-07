#!/bin/sh

DERIVED_DATA=$PWD//DerivedData/libimobiledevice-node/Build/Products/Debug
INSTALL_PATH=$PWD/dependencies

echo ""
echo "Link to libimobiledevice.6.dylib, libusbmuxd.4.dylib,  libplist.3.dylib"
echo "-------------------------------------------"

echo "[✔] ideviceinfo"
install_name_tool -change @rpath/../lib/libimobiledevice.6.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib $INSTALL_PATH/bin/ideviceinfo
install_name_tool -change @rpath/../lib/libusbmuxd.4.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib $INSTALL_PATH/bin/ideviceinfo
install_name_tool -change @rpath/../lib/libplist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib $INSTALL_PATH/bin/ideviceinfo

echo "[✔] idevicebackup2"
install_name_tool -change @rpath/../lib/libimobiledevice.6.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib $INSTALL_PATH/bin/idevicebackup2
install_name_tool -change @rpath/../lib/libusbmuxd.4.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib $INSTALL_PATH/bin/idevicebackup2
install_name_tool -change @rpath/../lib/libplist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib $INSTALL_PATH/bin/idevicebackup2

echo "[✔] libimobiledevice.6.dylib"
install_name_tool -change @rpath/../lib/libimobiledevice.6.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib
install_name_tool -change @rpath/../lib/libusbmuxd.4.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib
install_name_tool -change @rpath/../lib/libplist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib

echo "[✔] libusbmuxd.4.dylib"
install_name_tool -change @rpath/../lib/libusbmuxd.4.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib
install_name_tool -change @rpath/../lib/libplist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib $INSTALL_PATH/lib/libusbmuxd.4.dylib

echo "[✔] libplist.3.dylib"
install_name_tool -change @rpath/../lib/libplist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib

echo "[✔] libimobiledevice-node.dylib"
install_name_tool -change @rpath/../lib/libimobiledevice-node.dylib $INSTALL_PATH/lib/libimobiledevice-node.dylib $INSTALL_PATH/lib/libimobiledevice-node.dylib
install_name_tool -change @rpath/../lib/libimobiledevice.dylib $INSTALL_PATH/lib/libimobiledevice.6.dylib $INSTALL_PATH/lib/libimobiledevice-node.dylib
install_name_tool -change @rpath/../lib/plist.3.dylib $INSTALL_PATH/lib/libplist.3.dylib $INSTALL_PATH/lib/libimobiledevice-node.dylib
