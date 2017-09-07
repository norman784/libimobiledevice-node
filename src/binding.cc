#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>

#include <nan.h>
#include <functional>
#include <iostream>

#include "utils.h"

using namespace Nan;
using namespace v8;

static void throw_exception(Isolate *isolate, Local<Function> callback, Local<String> error) {
  Handle<Value> res[2];
  res[0] = error;
  res[1] = Null(isolate);

  callback->Call(Null(isolate), 2, res);
}

NAN_METHOD(ideviceinfo) {
  Nan:: HandleScope scope;
  Isolate* isolate = info.GetIsolate();

  Local<Function> callback = Local<Function>::Cast(info[1]);


  lockdownd_client_t client = NULL;
	lockdownd_error_t ldret = LOCKDOWN_E_UNKNOWN_ERROR;
	idevice_t device = NULL;
	idevice_error_t ret = IDEVICE_E_UNKNOWN_ERROR;
	int i;
	int simple = 0;
	// int format = FORMAT_KEY_VALUE;
	const char* udid = NULL;
	char *domain = NULL;
	char *key = NULL;
	char *xml_doc = NULL;
	uint32_t xml_length;
	plist_t node = NULL;

	idevice_set_debug_level(1);

  ret = idevice_new(&device, udid);
  if (ret != IDEVICE_E_SUCCESS) {
    if (udid) {
      throw_exception(isolate, callback,
        String::Concat(
          String::NewFromUtf8(isolate, "No device found with udid "),
          String::Concat(
            String::NewFromUtf8(isolate, udid),
            String::NewFromUtf8(isolate, ", is it plugged in?")
          )
        )
      );
    } else {
      throw_exception(isolate, callback, String::NewFromUtf8(isolate, "No device found, is it plugged in?"));
    }
    return;
  }

  if (LOCKDOWN_E_SUCCESS != (ldret = simple ?
    lockdownd_client_new(device, &client, "ideviceinfo"):
    lockdownd_client_new_with_handshake(device, &client, "ideviceinfo"))) {
    throw_exception(isolate, callback,
      String::Concat(
        String::NewFromUtf8(isolate, "ERROR: Could not connect to lockdownd, error code "),
        String::NewFromUtf8(isolate, (const char*)ldret)
      )
    );
    idevice_free(device);
    return;
  }

	/* run query and output information */
	if(lockdownd_get_value(client, domain, key, &node) == LOCKDOWN_E_SUCCESS) {
		if (node) {
			// switch (format) {
			// case FORMAT_KEY_VALUE:
				plist_print_to_stream(node, stdout);
			// 	break;
			// default:
			// 	if (key != NULL)
			// 		// plist_print_to_stream(node, stdout);
			// break;
			// }
			plist_free(node);
			node = NULL;
		}
	}

	if (domain != NULL) free(domain);
	lockdownd_client_free(client);
	idevice_free(device);

  Handle<Value> res[2];
  res[0] = Null(isolate);
  res[1] = String::NewFromUtf8(isolate, "stdout");

  callback->Call(Null(isolate), 2, res);
}

NAN_MODULE_INIT(Initialize) {
  NAN_EXPORT(target, ideviceinfo);
}

NODE_MODULE(binding, Initialize)
