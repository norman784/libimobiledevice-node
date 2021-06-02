#!/bin/sh

echo ""
echo "Change absolute path to relative path"
echo "-------------------------------------------"

echo "[✔] imobiledevice.node"
install_name_tool -change $PWD/dependencies/lib/libimobiledevice-1.0.6.dylib @loader_path/../../dependencies/lib/libimobiledevice-1.0.6.dylib $PWD/build/Release/imobiledevice.node
install_name_tool -change $PWD/dependencies/lib/libplist-2.0.3.dylib @loader_path/../../dependencies/lib/libplist-2.0.3.dylib $PWD/build/Release/imobiledevice.node
install_name_tool -change $PWD/dependencies/lib/libusbmuxd-2.0.6.dylib @loader_path/../../dependencies/lib/libusbmuxd-2.0.6.dylib $PWD/build/Release/imobiledevice.node

echo "Done postinstall"
