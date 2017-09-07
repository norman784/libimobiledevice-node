#include <idevice/info.h>
#include <node.h>

using namespace v8;

namespace idevice_info_node {
  void info(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Local<Function> callback = Local<Function>::Cast(args[1]);

    idevice_info_options options;
    options.debug = true;
    options.simple = false;

    FILE *err = tmpfile();
    FILE *data = tmpfile();

    idevice_info_stream(options, err, data);

    Handle<Value> res[2];
    res[0] = String::NewFromUtf8(isolate, read_stream(err).c_str());
    res[1] = String::NewFromUtf8(isolate, read_stream(data).c_str());

    callback->Call(Null(isolate), 2, res);
  }
}
void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "idevice_info", idevice_info_node::info);
}

NODE_MODULE(binding, Initialize);
