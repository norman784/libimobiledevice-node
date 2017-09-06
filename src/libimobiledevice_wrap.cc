#include <node.h>
#include "ideviceinfo.cc"

using v8::Local;
using v8::Object;

void Initialize(Local<Object> exports) {
NODE_SET_METHOD(exports, "info", device_info);
// NODE_SET_METHOD(exports, "backup2", device::Backup2);
}

NODE_MODULE(libimobiledevice, Initialize);
