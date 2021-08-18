#!/bin/sh

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
echo ""
echo "Change absolute path to relative path"
echo "-------------------------------------------"

echo "[✔] imobiledevice.node"
install_name_tool -change $SCRIPT_PATH/../dependencies/lib/libimobiledevice-1.0.6.dylib @loader_path/../../dependencies/lib/libimobiledevice-1.0.6.dylib $SCRIPT_PATH/../build/Release/imobiledevice.node
install_name_tool -change $SCRIPT_PATH/../dependencies/lib/libplist-2.0.3.dylib @loader_path/../../dependencies/lib/libplist-2.0.3.dylib $SCRIPT_PATH/../build/Release/imobiledevice.node
install_name_tool -change $SCRIPT_PATH/../dependencies/lib/libusbmuxd-2.0.6.dylib @loader_path/../../dependencies/lib/libusbmuxd-2.0.6.dylib $SCRIPT_PATH/../build/Release/imobiledevice.node

echo "Done postinstall"


