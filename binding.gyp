{
    "targets": [
        {
          "target_name": "libimobiledevice",
          "sources": [ 
            "src/binding.cc",
            "src/idevice/id.h",
            "src/idevice/id.c",
            "src/idevice/info.h",
            "src/idevice/info.c",
            "src/idevice/backup2.h",
            "src/idevice/backup2.c",
            "src/common/endianness.h",
            "src/common/common_binding.h",
            "src/common/common_binding.c",
            "src/common/utils.h",
            "src/common/utils.c"
          ],
          "include_dirs": [
            "dependencies/include",
            "src"
          ],
          "libraries": [
            "<(module_root_dir)/dependencies/lib/libplist.3.dylib",
            "<(module_root_dir)/dependencies/lib/libimobiledevice.6.dylib"
          ]
        }
  ]
}
