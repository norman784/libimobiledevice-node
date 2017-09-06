#include <node.h>
#include "libimobiledevice_node.cc"
// #include <libimobiledevice/lockdown.h>

using v8::Local;
using v8::Object;

/*
idevice_set_debug_level
idevice_new
lockdownd_client_new
lockdownd_client_new_with_handshake
idevice_free
lockdownd_get_value
plist_to_xml
plist_print_to_stream
plist_free
free
lockdownd_client_free
idevice_free
*/

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "idevice_set_debug_level", idevice_set_debug_level_wrap);
  NODE_SET_METHOD(exports, "idevice_new", idevice_new_wrap);
}

NODE_MODULE(libimobiledevice, Initialize);
