{
    "targets": [
        {
          "target_name": "binding",
          "sources": [ "binding.cc" ],
          "include_dirs": [
            "dependencies/include",
            "lib"
          ],
          "libraries": [
            "<(module_root_dir)/dependencies/lib/libplist.3.dylib",
            "<(module_root_dir)/dependencies/lib/libimobiledevice.6.dylib",
            "<(module_root_dir)/dependencies/lib/libimobiledevice-node.dylib"
          ]
        }
  ]
}
