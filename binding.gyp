{
    "targets": [
        {
            "target_name": "libimobiledevice",
            "sources": [
                "src/libimobiledevice_wrap.cc",
                "tmp/libimobiledevice/tools/ideviceinfo.c"
            ],
            "include_dirs": [
                "dependencies/include",
                "tmp/libimobiledevice/include",
                "tmp/libimobiledevice",
                "src"
            ],
            "libraries": [
                "<(module_root_dir)/dependencies/lib/libimobiledevice.6.dylib"
            ],
            "cflags_cc!": [ "-fno-rtti", "-fno-exceptions" ],
            "cflags!": [ "-fno-exceptions" ],
            "conditions": [
                [ 'OS=="mac"', {
                    "xcode_settings": {
                        'OTHER_CPLUSPLUSFLAGS' : ['-std=c++11','-stdlib=libc++', '-v'],
                        'OTHER_LDFLAGS': ['-stdlib=libc++'],
                        'MACOSX_DEPLOYMENT_TARGET': '10.7',
                        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                    }
                }]
            ]
        }
    ]
}
