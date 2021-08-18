@echo off
set installation_dir="dependencies"
set vcpkg_dir="vcpkg"

if not exist %installation_dir% (
    if not exist %vcpkg_dir% (
        echo 'Cloning vcpkg'
        git clone https://github.com/didix21/vcpkg.git

        echo 'Installing vcpkg'
        vcpkg\bootstrap-vcpkg.bat
    )
)