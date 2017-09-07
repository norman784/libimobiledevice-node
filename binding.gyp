{
  "targets": [
    {
      "target_name": "binding",
      "sources": [ "src/binding.cc" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")",
        "dependencies/include"
        "src"
      ],
      "libraries": [
        "<(module_root_dir)/dependencies/lib/libimobiledevice.6.dylib",
        "<(module_root_dir)/dependencies/lib/libplist.3.dylib"
      ]
    }
  ]
}
