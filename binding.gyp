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
              "link_settings": {
                "libraries": [
                  "<(module_root_dir)/dependencies/lib/libplist-2.0.3.dylib",
                  "<(module_root_dir)/dependencies/lib/libusbmuxd-2.0.6.dylib",
                  "<(module_root_dir)/dependencies/lib/libimobiledevice-1.0.6.dylib"
                ]
              }
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
                "dependencies/plist/include",
                "dependencies/include",
                "dependencies/libimobiledevice/include"
              ],
              "link_settings": {
                "libraries": [
                  "-l<(module_root_dir)/dependencies/lib/libcrypto-1_1-x64.dll.a",
                  "<(module_root_dir)/dependencies/lib/libssl-1_1-x64.dll.a",
                  "<(module_root_dir)/dependencies/lib/libplist-2.0.dll.a",
                  "<(module_root_dir)/dependencies/lib/libusbmuxd-2.0.dll.a",
                  "<(module_root_dir)/dependencies/lib/libimobiledevice-1.0.dll.a",
                ]
              },
              "copies": [
                {
                "destination": "<(module_root_dir)/build/Release/",
                    "files": [
                        "<(module_root_dir)/dependencies/lib/libcrypto-1_1-x64.dll",
                        "<(module_root_dir)/dependencies/lib/libssl-1_1-x64.dll",
                        "<(module_root_dir)/dependencies/lib/libplist-2.0.dll",
                        "<(module_root_dir)/dependencies/lib/libusbmuxd-2.0.dll",
                        "<(module_root_dir)/dependencies/lib/libimobiledevice-1.0.dll",
                    ]
                },
              ]
            }
          ]
        ]
      },
      {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': [ 'imobiledevice' ],
      'hard_dependency': 1,
      'conditions': [
        ['OS!="win"',
          {
            'actions': [
              {
                'action_name': 'postinstall',
                'inputs': ['./scripts/postinstall.py'],
                'outputs': [''],
                'action': ['./scripts/postinstall.py']
              }
            ]
          }
        ]
      ]
    },

  ]
}
