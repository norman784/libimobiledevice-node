#include <node.h>

#include <libimobiledevice/libimobiledevice.h>
#include "common.cc"

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Value;

void idevice_set_debug_level_wrap(const FunctionCallbackInfo<Value>& args) {
  idevice_set_debug_level((int) args[0]->Int32Value());
}

void idevice_new_wrap(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  idevice_t device = NULL;
  idevice_error_t ret = IDEVICE_E_UNKNOWN_ERROR;
  const char* udid = NULL;

  Local<String> _udid;
  Local<Function> callback;

  if (args[0]->IsString()) {
    _udid = args[0]->ToString();
  }

  if (args[0]->IsFunction()) {
    callback = Local<Function>::Cast(args[0]);
  } else if (args[1]->IsFunction()) {
    callback = Local<Function>::Cast(args[1]);
  } else {
    isolate->ThrowException(Exception::TypeError(
      String::NewFromUtf8(isolate, "No callback found")
    ));
    return;
  }

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

  Handle<Value> res[2];
  res[0] = Null(isolate);
  res[1] = String::NewFromUtf8(isolate, "stdout");

  callback->Call(Null(isolate), 2, res);
}
