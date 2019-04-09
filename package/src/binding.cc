extern "C" {
    #include <idevice/id.h>
    #include <idevice/info.h>
    #include <idevice/backup2.h>
    #include <idevice/pair.h>
}

#include <node.h>

using namespace v8;

namespace idevice_info_node {
    Isolate *_isolate;
    Local<Function> _progressCallback;
    
    char *ToCString(const Handle<Value>& value) {
        if (!value->IsString()) return NULL;
        String::Utf8Value string(value);
        char *str = (char *) malloc(string.length() - 1);
        strcpy(str, *string);
        return str;
    }
    
    void progressCallback(FILE *stream_progress) {
        Handle<Value> res[2];
        res[0] = String::NewFromUtf8(_isolate, read_stream(stream_progress));
        _progressCallback->Call(Null(_isolate), 1, res);
    }
    
    void backup2(const FunctionCallbackInfo<Value>& args) {
        _isolate = args.GetIsolate();
        Local<Function> callback;
        Handle<Object> object;
        
        if (args.Length() < 3) {
            fprintf(stderr, "No arguments provided, this method requires 3 parameters.\n");
            return;
        }
        
        if (!args[0]->IsObject()) {
            fprintf(stderr, "First argument is an object\n");
            return;
        }
        
        if (!args[1]->IsFunction()) {
            fprintf(stderr, "Second argument must be a function\n");
            return;
        }
        
        object = Handle<Object>::Cast(args[0]);
        callback = Local<Function>::Cast(args[1]);
        
        if (!args[2]->IsFunction()) {
            Handle<Value> res[2];
            res[0] = String::NewFromUtf8(_isolate, "Third argument must be a function");
            res[1] = String::NewFromUtf8(_isolate, NULL);
            callback->Call(Null(_isolate), 2, res);
            return;
        }
        
        _progressCallback = Local<Function>::Cast(args[2]);
        
        Handle<Value> debug = object->Get(String::NewFromUtf8(_isolate, "debug"));
        Handle<Value> udid = object->Get(String::NewFromUtf8(_isolate, "udid"));
        Handle<Value> source = object->Get(String::NewFromUtf8(_isolate, "source"));
        Handle<Value> backup = object->Get(String::NewFromUtf8(_isolate, "backup"));
        Handle<Value> restore = object->Get(String::NewFromUtf8(_isolate, "restore"));
        Handle<Value> system = object->Get(String::NewFromUtf8(_isolate, "system"));
        Handle<Value> reboot = object->Get(String::NewFromUtf8(_isolate, "reboot"));
        Handle<Value> copy = object->Get(String::NewFromUtf8(_isolate, "copy"));
        Handle<Value> settings = object->Get(String::NewFromUtf8(_isolate, "settings"));
        Handle<Value> remove = object->Get(String::NewFromUtf8(_isolate, "remove"));
        Handle<Value> password = object->Get(String::NewFromUtf8(_isolate, "password"));
        Handle<Value> cloud = object->Get(String::NewFromUtf8(_isolate, "cloud"));
        Handle<Value> full = object->Get(String::NewFromUtf8(_isolate, "full"));
        Handle<Value> info = object->Get(String::NewFromUtf8(_isolate, "info"));
        Handle<Value> list = object->Get(String::NewFromUtf8(_isolate, "list"));
        Handle<Value> unback = object->Get(String::NewFromUtf8(_isolate, "unback"));
        Handle<Value> encryption = object->Get(String::NewFromUtf8(_isolate, "encryption"));
        Handle<Value> interactive = object->Get(String::NewFromUtf8(_isolate, "interactive"));
        Handle<Value> changepw = object->Get(String::NewFromUtf8(_isolate, "changepw"));
        Handle<Value> backup_directory = object->Get(String::NewFromUtf8(_isolate, "backup_directory"));
        
        idevice_backup2_options options;
        options.debug = false;
        options.udid = NULL;
        options.source = NULL;
        options.backup = false;
        options.restore = false;
        options.system = false;
        options.reboot = false;
        options.copy = false;
        options.settings = false;
        options.remove = false;
        options.password = NULL;
        options.cloud = NULL;
        options.full = false;
        options.info = false;
        options.list = false;
        options.unback = false;
        options.interactive = false;
        options.encryption.status = NULL;
        options.encryption.password = NULL;
        options.changepw.backup_password = NULL;
        options.changepw.newpw = NULL;
        options.backup_directory = NULL;
        
        if (debug->IsBoolean()) { options.debug = debug->BooleanValue(); }
        if (udid->IsString()) { options.udid = ToCString(udid); }
        if (source->IsString()) { options.source = ToCString(source); }
        if (backup->IsBoolean()) { options.backup = backup->BooleanValue(); }
        if (restore->IsBoolean()) { options.restore = restore->BooleanValue(); }
        if (system->IsBoolean()) { options.system = system->BooleanValue(); }
        if (reboot->IsBoolean()) { options.reboot = reboot->BooleanValue(); }
        if (copy->IsBoolean()) { options.copy = copy->BooleanValue(); }
        if (settings->IsBoolean()) { options.settings = settings->BooleanValue(); }
        if (remove->IsBoolean()) { options.remove = remove->BooleanValue(); }
        if (password->IsString()) { options.password = ToCString(password); }
        if (cloud->IsString()) { options.cloud = ToCString(cloud); }
        if (full->IsBoolean()) { options.full = full->BooleanValue(); }
        if (info->IsBoolean()) { options.info = info->BooleanValue(); }
        if (list->IsBoolean()) { options.list = list->BooleanValue(); }
        if (interactive->IsBoolean()) { options.interactive = interactive->BooleanValue(); }
        if (unback->IsBoolean()) { options.unback = unback->BooleanValue(); }
        if (backup_directory->IsString()) { options.backup_directory = ToCString(backup_directory); }
        if (encryption->IsObject()) {
            Local<Object> obj = encryption->ToObject();
            Handle<Value> status = obj->Get(String::NewFromUtf8(_isolate, "status"));
            Handle<Value> password = obj->Get(String::NewFromUtf8(_isolate, "password"));
            if (status->IsString()) options.encryption.status = ToCString(status);
            if (password->IsString()) options.encryption.password = ToCString(password);
        }
        if (changepw->IsObject()) {
            Local<Object> obj = changepw->ToObject();
            Handle<Value> newpw = obj->Get(String::NewFromUtf8(_isolate, "newpw"));
            Handle<Value> backup_password = obj->Get(String::NewFromUtf8(_isolate, "backup_password"));
            if (newpw->IsString()) options.changepw.newpw = ToCString(newpw);
            if (backup_password->IsString()) options.changepw.backup_password = ToCString(backup_password);
        }
        
        FILE *stream_err = tmpfile();
        FILE *stream_out = tmpfile();
        
        idevice_backup2(options, stream_err, stream_out, &progressCallback);
        
        Handle<Value> res[2];
        res[0] = String::NewFromUtf8(_isolate, read_stream(stream_err));
        res[1] = String::NewFromUtf8(_isolate, read_stream(stream_out));
        
        callback->Call(Null(_isolate), 2, res);
    }
    
    void info(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        
        Local<Function> callback = Local<Function>::Cast(args[1]);
        Handle<Object> object = Handle<Object>::Cast(args[0]);
        Handle<Value> debug = object->Get(String::NewFromUtf8(isolate, "debug"));
        Handle<Value> domain = object->Get(String::NewFromUtf8(isolate, "domain"));
        Handle<Value> key = object->Get(String::NewFromUtf8(isolate, "key"));
        Handle<Value> udid = object->Get(String::NewFromUtf8(isolate, "udid"));
        Handle<Value> simple = object->Get(String::NewFromUtf8(isolate, "simple"));
        
        idevice_info_options options;
        options.debug = true;
        options.simple = false;
        options.domain = NULL;
        options.key = NULL;
        options.udid = NULL;
        
        if (debug->IsBoolean()) { options.debug = debug->BooleanValue(); }
        if (domain->IsString()) { options.domain = ToCString(domain); }
        if (key->IsString()) { options.key = ToCString(key); }
        if (udid->IsString()) { options.udid = ToCString(udid); }
        if (simple->IsBoolean()) { options.simple = simple->BooleanValue(); }
        
        FILE *err = tmpfile();
        FILE *data = tmpfile();
        
        idevice_info(options, err, data);
        
        Handle<Value> res[2];
        res[0] = String::NewFromUtf8(isolate, read_stream(err));
        res[1] = String::NewFromUtf8(isolate, read_stream(data));
        
        callback->Call(Null(isolate), 2, res);
    }

    void pair(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        
        Local<Function> callback = Local<Function>::Cast(args[1]);
        Handle<Value> command = Handle<Value>::Cast(args[0]);
        
        FILE *err = tmpfile();
        FILE *data = tmpfile();
        
        char* cmd = ToCString(command);
        idevice_pair(cmd, err, data);
        
        Handle<Value> res[2];
        res[0] = String::NewFromUtf8(isolate, read_stream(err));
        res[1] = String::NewFromUtf8(isolate, read_stream(data));
        
        callback->Call(Null(isolate), 2, res);
    }

    void id(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        Local<Function> callback = Local<Function>::Cast(args[0]);

        FILE *data = tmpfile();
        
        idevice_id(data);
        
        Handle<Value> res[1];
        res[0] = String::NewFromUtf8(isolate, read_stream(data));
        
        callback->Call(Null(isolate), 1, res);
    }
}
void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "idevice_backup2", idevice_info_node::backup2);
    NODE_SET_METHOD(exports, "idevice_info", idevice_info_node::info);
    NODE_SET_METHOD(exports, "idevice_id", idevice_info_node::id);
    NODE_SET_METHOD(exports, "idevice_pair", idevice_info_node::pair);
}

NODE_MODULE(binding, Initialize);
