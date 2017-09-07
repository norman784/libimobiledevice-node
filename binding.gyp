{
    "targets": [
        {
          "target_name": "binding",
          "sources": [ "src/binding.cc", "src/idevice/info.cc", "src/common/utils.c" ],
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
