@echo off


set installation_dir="dependencies"
set plist_dir="libplist"
set usbmuxd_dir="libusbmuxd"
set imobiledevice_dir="libimobiledevice"
set vcpkg_dir="vcpkg"
set bin_dir="bin"
set lib_dir="lib"
set err_path_not_exist="path does not exist"
set include_dir="include"
set win32_rel_dir="Win32\Release"

if not exist %installation_dir% (

    if exist %vcpkg_dir% (
        REM Must go inside vcpkg to compile 
        copy x86-windows.cmake vcpkg\triplets\
        cd vcpkg
        vcpkg integrate install 
        echo 'Installing vcpkg packages'
        if not exist "buildtrees\openssl\" (
            vcpkg install openssl
        )
        if not exist "buildtrees\dirent\" (
            vcpkg install dirent 
        )
        if not exist "buildtrees\getopt\" (
            vcpkg install getopt 
        )
        cd ..
    )


    echo 'Cloning libplist, libusbmuxd and libimobiledevice'
    if not exist %plist_dir% (
        git clone -b msvc-qustodio --single-branch https://github.com/didix21/libplist.git --depth 1
    )

    if not exist %usbmuxd_dir% (
        git clone -b msvc-qustodio --single-branch https://github.com/didix21/libusbmuxd.git --depth 1
    )

    if not exist %imobiledevice_dir% (
        git clone -b msvc-qustodio https://github.com/didix21/libimobiledevice.git --depth 1
    )

    echo **************************************
    echo 'Compiling libplist Solution'
    msbuild /m libplist\libplist.sln /p:Configuration=Release /p:Platform=Win32 /t:Rebuild


    echo **************************************
    echo 'Compiling libusbmuxd Solution'
    msbuild /m libusbmuxd\libusbmuxd.sln /p:Configuration=Release /p:Platform=Win32 /t:Rebuild

    echo **************************************
    echo 'Compiling libimobiledevice Solution'
    echo 'Compiling ibimobiledevice project'

    echo 'Compiling idevice_id project'
    msbuild /m libimobiledevice\libimobiledevice.sln /p:Configuration=Release /p:Platform=Win32 /t:idevice_id:Rebuild

    echo 'Compiling ideviceinfo project'
    msbuild /m libimobiledevice\libimobiledevice.sln /p:Configuration=Release /p:Platform=Win32 /t:ideviceinfo:Rebuild

    echo 'Compiling idevicebackup2 project'
    msbuild /m libimobiledevice\libimobiledevice.sln /p:Configuration=Release /p:Platform=Win32 /t:idevicebackup2:Rebuild

    echo 'Compiling idevicepair project'
    msbuild /m libimobiledevice\libimobiledevice.sln /p:Configuration=Release /p:Platform=Win32 /t:idevicepair:Rebuild

    echo Creating %installation_dir% path
    md %installation_dir%

    if exist %installation_dir% (
        
        if exist %vcpkg_dir% (
            move %vcpkg_dir%\installed\x86-windows %installation_dir%
        ) else (
            echo ERROR %vcpkg_dir% %err_path_not_exist%
            exit
        )

        for %%i in (
            %plist_dir%
            %usbmuxd_dir%
            %imobiledevice_dir%
        ) do (
            md %installation_dir%\%%i\%bin_dir%
            md %installation_dir%\%%i\%lib_dir%
            move %%i\%include_dir% %installation_dir%\%%i\%include_dir%
            move %%i\%win32_rel_dir%\*.lib %installation_dir%\%%i\%lib_dir%
            move %%i\%win32_rel_dir%\*.dll %installation_dir%\%%i\%bin_dir%
        )

    ) else (
        echo ERROR %installation_dir% %err_path_not_exist%
        exit 
    )

    echo Deleting vcpkg, libplist, libusbmuxd and libimobiledevice
    rmdir /Q /S vcpkg libplist libusbmuxd libimobiledevice
)

