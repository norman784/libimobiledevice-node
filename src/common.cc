#include <node.h>

using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Value;

static void throw_exception(Isolate *isolate, Local<Function> callback, Local<String> error) {
  Handle<Value> res[2];
  res[0] = error;
  res[1] = Null(isolate);

  callback->Call(Null(isolate), 2, res);
}
