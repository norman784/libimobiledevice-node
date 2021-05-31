{
    "targets": [
        {
          "target_name": "imobiledevice",
          "sources": [ 
            "src/binding.cc",
            "src/idevice/id.h",
            "src/idevice/id.c",
            "src/idevice/info.h",
            "src/idevice/info.c",
            "src/idevice/backup2.h",
            "src/idevice/backup2.c",
            "src/idevice/pair.h",
            "src/idevice/pair.c",
            "src/common/endianness.h",
            "src/common/common_binding.h",
            "src/common/common_binding.c",
            "src/common/utils.h",
            "src/common/utils.c",
            "src/common/userpref.h",
            "src/common/userpref.c",
            "src/src/msc_config.h",
            "src/src/msc_compat.h"
        ],
        "include_dirs": [
          "src"
        ],
        "conditions": [
          ['OS=="mac"',
            { "defines": [
              'HAVE_OPENSSL',
              'HAVE_STPCPY'
            ],
              "include_dirs": [
                "dependencies/include"
              ],
              "libraries": [
                "<(module_root_dir)/dependencies/lib/libplist-2.0.3.dylib",
                "<(module_root_dir)/dependencies/lib/libusbmuxd-2.0.6.dylib",
                "<(module_root_dir)/dependencies/lib/libimobiledevice-1.0.6.dylib"
              ]
            }
          ],
          ['OS=="win"',
            { "defines": [
              'HAVE_OPENSSL',
              'WIN32'
            ],
             'sources' : [
               "src/common/libgen.h",
               "src/common/libgen.c"
             ],
              "include_dirs": [
                "dependencies/x86-windows/include",
                "dependencies/libplist/include",
                "dependencies/libusbmuxd/include",
                "dependencies/libimobiledevice/include"
              ],
              "libraries": [
                "<(module_root_dir)/dependencies/x86-windows/lib/*.lib",
                "<(module_root_dir)/dependencies/libplist/lib/plist.lib",
                "<(module_root_dir)/dependencies/libusbmuxd/lib/usbmuxd.lib",
                "<(module_root_dir)/dependencies/libimobiledevice/lib/imobiledevice.lib"
              ]
            }
          ]
        ]
      }
  ]
}
