@echo off

set installation_dir="dependencies"
set plist_installation_dir=%installation_dir%\"libplist"
set usbmuxd_installation_dir=%installation_dir%\"libusbmuxd"
set imobiledevice_installation_dir=%installation_dir%\"libimobiledevice"
set bin_dir="bin"
set err_path_not_exist="path does not exist"
set node_build_dir="build\Release"

if exist %node_build_dir% (

    echo Copying plist.dll to %node_build_dir%
    copy %plist_installation_dir%\%bin_dir%\plist.dll %node_build_dir%

    echo Copying usbmu.dll to %node_build_dir%
    copy %usbmuxd_installation_dir%\%bin_dir%\usbmuxd.dll %node_build_dir%

    echo Copying imibiledevice dlls to %node_build_dir%
    copy %imobiledevice_installation_dir%\%bin_dir%\*.dll %node_build_dir%

) else (
    echo ERROR %node_build_dir% %err_path_not_exist%
)