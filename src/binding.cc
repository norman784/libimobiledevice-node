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
    
    char *ToCString(Isolate* isolate, const Local<Value>& value) {
        if (!value->IsString()) return NULL;
        String::Utf8Value string(isolate, value);
        char *str = (char *) malloc(string.length() - 1);
        strcpy(str, *string);
        return str;
    }
    
    void progressCallback(FILE *stream_progress) {
        const unsigned argc = 1;
        Local<Value> argv[argc] = { String::NewFromUtf8(_isolate, read_stream(stream_progress)).ToLocalChecked() };
        _progressCallback->Call(_isolate->GetCurrentContext(), Null(_isolate), argc, argv).ToLocalChecked();
    }
    
    void backup2(const FunctionCallbackInfo<Value>& args) {
        _isolate = args.GetIsolate();
        Local<Context> context = _isolate->GetCurrentContext();  
        
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
        
        Local<Object> object = Local<Object>::Cast(args[0]);
        Local<Function> callback = Local<Function>::Cast(args[1]);
        
        if (!args[2]->IsFunction()) {
            const unsigned argc = 2;
            Local<Value> argv[argc] = {String::NewFromUtf8(_isolate, "Third argument must be a function").ToLocalChecked(), String::NewFromUtf8(_isolate, NULL).ToLocalChecked() };
            callback->Call(context, Null(_isolate), argc, argv).ToLocalChecked();
            return;
        }
        
        _progressCallback = Local<Function>::Cast(args[2]);
        
        Local<Value> debug = object->Get(context, String::NewFromUtf8(_isolate, "debug").ToLocalChecked()).ToLocalChecked();
        Local<Value> udid = object->Get(context, String::NewFromUtf8(_isolate, "udid").ToLocalChecked()).ToLocalChecked();
        Local<Value> source = object->Get(context, String::NewFromUtf8(_isolate, "source").ToLocalChecked()).ToLocalChecked();
        Local<Value> backup = object->Get(context, String::NewFromUtf8(_isolate, "backup").ToLocalChecked()).ToLocalChecked();
        Local<Value> restore = object->Get(context, String::NewFromUtf8(_isolate, "restore").ToLocalChecked()).ToLocalChecked();
        Local<Value> system = object->Get(context, String::NewFromUtf8(_isolate, "system").ToLocalChecked()).ToLocalChecked();
        Local<Value> reboot = object->Get(context, String::NewFromUtf8(_isolate, "reboot").ToLocalChecked()).ToLocalChecked();
        Local<Value> copy = object->Get(context, String::NewFromUtf8(_isolate, "copy").ToLocalChecked()).ToLocalChecked();
        Local<Value> settings = object->Get(context, String::NewFromUtf8(_isolate, "settings").ToLocalChecked()).ToLocalChecked();
        Local<Value> remove = object->Get(context, String::NewFromUtf8(_isolate, "remove").ToLocalChecked()).ToLocalChecked();
        Local<Value> password = object->Get(context, String::NewFromUtf8(_isolate, "password").ToLocalChecked()).ToLocalChecked();
        Local<Value> cloud = object->Get(context, String::NewFromUtf8(_isolate, "cloud").ToLocalChecked()).ToLocalChecked();
        Local<Value> full = object->Get(context, String::NewFromUtf8(_isolate, "full").ToLocalChecked()).ToLocalChecked();
        Local<Value> info = object->Get(context, String::NewFromUtf8(_isolate, "info").ToLocalChecked()).ToLocalChecked();
        Local<Value> list = object->Get(context, String::NewFromUtf8(_isolate, "list").ToLocalChecked()).ToLocalChecked();
        Local<Value> unback = object->Get(context, String::NewFromUtf8(_isolate, "unback").ToLocalChecked()).ToLocalChecked();
        Local<Value> encryption = object->Get(context, String::NewFromUtf8(_isolate, "encryption").ToLocalChecked()).ToLocalChecked();
        Local<Value> interactive = object->Get(context, String::NewFromUtf8(_isolate, "interactive").ToLocalChecked()).ToLocalChecked();
        Local<Value> changepw = object->Get(context, String::NewFromUtf8(_isolate, "changepw").ToLocalChecked()).ToLocalChecked();
        Local<Value> backup_directory = object->Get(context, String::NewFromUtf8(_isolate, "backup_directory").ToLocalChecked()).ToLocalChecked();
        
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
        
        if (debug->IsBoolean()) { options.debug = debug->BooleanValue(_isolate); }
        if (udid->IsString()) { options.udid = ToCString(_isolate, udid); }
        if (source->IsString()) { options.source = ToCString(_isolate, source); }
        if (backup->IsBoolean()) { options.backup = backup->BooleanValue(_isolate); }
        if (restore->IsBoolean()) { options.restore = restore->BooleanValue(_isolate); }
        if (system->IsBoolean()) { options.system = system->BooleanValue(_isolate); }
        if (reboot->IsBoolean()) { options.reboot = reboot->BooleanValue(_isolate); }
        if (copy->IsBoolean()) { options.copy = copy->BooleanValue(_isolate); }
        if (settings->IsBoolean()) { options.settings = settings->BooleanValue(_isolate); }
        if (remove->IsBoolean()) { options.remove = remove->BooleanValue(_isolate); }
        if (password->IsString()) { options.password = ToCString(_isolate, password); }
        if (cloud->IsString()) { options.cloud = ToCString(_isolate, cloud); }
        if (full->IsBoolean()) { options.full = full->BooleanValue(_isolate); }
        if (info->IsBoolean()) { options.info = info->BooleanValue(_isolate); }
        if (list->IsBoolean()) { options.list = list->BooleanValue(_isolate); }
        if (interactive->IsBoolean()) { options.interactive = interactive->BooleanValue(_isolate); }
        if (unback->IsBoolean()) { options.unback = unback->BooleanValue(_isolate); }
        if (backup_directory->IsString()) { options.backup_directory = ToCString(_isolate, backup_directory); }
        if (encryption->IsObject()) {
            Local<Object> encryptionObject = encryption->ToObject(context).ToLocalChecked();
            Local<Value> status = encryptionObject->Get(context, String::NewFromUtf8(_isolate, "status").ToLocalChecked()).ToLocalChecked();
            Local<Value> password = encryptionObject->Get(context, String::NewFromUtf8(_isolate, "password").ToLocalChecked()).ToLocalChecked();
            if (status->IsString()) options.encryption.status = ToCString(_isolate, status);
            if (password->IsString()) options.encryption.password = ToCString(_isolate, password);
        }
        if (changepw->IsObject()) {
            Local<Object> changepwObject = changepw->ToObject(context).ToLocalChecked();
            Local<Value> newpw = changepwObject->Get(context, String::NewFromUtf8(_isolate, "newpw").ToLocalChecked()).ToLocalChecked();
            Local<Value> backup_password = changepwObject->Get(context, String::NewFromUtf8(_isolate, "backup_password").ToLocalChecked()).ToLocalChecked();
            if (newpw->IsString()) options.changepw.newpw = ToCString(_isolate, newpw);
            if (backup_password->IsString()) options.changepw.backup_password = ToCString(_isolate, backup_password);
        }
        
        FILE *stream_err = tmpfile();
        FILE *stream_out = tmpfile();
        
        idevice_backup2(options, stream_err, stream_out, &progressCallback);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { String::NewFromUtf8(_isolate, read_stream(stream_err)).ToLocalChecked(), String::NewFromUtf8(_isolate, read_stream(stream_out)).ToLocalChecked()};
        
        callback->Call(context, Null(_isolate), argc, argv).ToLocalChecked();
    }

    void pack_idevice_info_error(Isolate *isolate, Local<Context> &context, Local<Object> &ideviceInfoErrorObj, struct idevice_info_error *error) {
        ideviceInfoErrorObj->Set(context, String::NewFromUtf8(isolate, "infoError").ToLocalChecked(), Number::New(isolate, error->info_error)).Check();
        ideviceInfoErrorObj->Set(context, String::NewFromUtf8(isolate, "lockdownError").ToLocalChecked(), Number::New(isolate, error->lockdownd_error)).Check();
        ideviceInfoErrorObj->Set(context, String::NewFromUtf8(isolate, "ideviceError").ToLocalChecked(), Number::New(isolate, error->idevice_error)).Check();
        if(error->error_message != NULL) {
            ideviceInfoErrorObj->Set(context, String::NewFromUtf8(isolate, "errorMessage").ToLocalChecked(), String::NewFromUtf8(isolate, read_stream(error->error_message)).ToLocalChecked()).Check();
        } else {
            ideviceInfoErrorObj->Set(context, String::NewFromUtf8(isolate, "errorMessage").ToLocalChecked(), String::NewFromUtf8(isolate, "").ToLocalChecked()).Check();
        }
    }
    
    void info(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();
        
        Local<Function> callback = Local<Function>::Cast(args[1]);
        Local<Object> object = Local<Object>::Cast(args[0]);
        Local<Value> debug = object->Get(context, String::NewFromUtf8(isolate, "debug").ToLocalChecked()).ToLocalChecked();
        Local<Value> simple = object->Get(context, String::NewFromUtf8(isolate, "simple").ToLocalChecked()).ToLocalChecked();
        Local<Value> domain = object->Get(context, String::NewFromUtf8(isolate, "domain").ToLocalChecked()).ToLocalChecked();
        Local<Value> key = object->Get(context, String::NewFromUtf8(isolate, "key").ToLocalChecked()).ToLocalChecked();
        Local<Value> udid = object->Get(context, String::NewFromUtf8(isolate, "udid").ToLocalChecked()).ToLocalChecked();
        Local<Value> network = object->Get(context, String::NewFromUtf8(isolate, "network").ToLocalChecked()).ToLocalChecked();
        
        idevice_info_options options;
        options.debug = false;
        options.simple = false;
        options.domain = NULL;
        options.key = NULL;
        options.udid = NULL;
        options.network = false;

        if (debug->IsBoolean()) { options.debug = debug->BooleanValue(isolate); }
        if (simple->IsBoolean()) { options.simple = simple->BooleanValue(isolate); }
        if (domain->IsString()) { options.domain = ToCString(isolate, domain); }
        if (key->IsString()) { options.key = ToCString(isolate, key); }
        if (udid->IsString()) { options.udid = ToCString(isolate, udid); }
        if (network->IsBoolean()) { options.network = network->BooleanValue(isolate); }

        idevice_info_error error = default_idevice_info_error;
        error.error_message = tmpfile();
        FILE *data = tmpfile();
        
        idevice_info(options, &error, data);

        Local<Object> ideviceInfoError = Object::New(isolate);
        pack_idevice_info_error(isolate, context, ideviceInfoError, &error);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { ideviceInfoError, String::NewFromUtf8(isolate, read_stream(data)).ToLocalChecked() };
        
        callback->Call(context, Null(isolate), argc, argv).ToLocalChecked();
    }

    void pack_idevice_pair_error(Isolate *isolate, Local<Context> &context, Local<Object> &idevicePairErrorObj, struct idevice_pair_error *error) {
        idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "pairError").ToLocalChecked(), Number::New(isolate, error->pair_error)).Check();
        idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "lockdownError").ToLocalChecked(), Number::New(isolate, error->lockdownd_error)).Check();
        idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "ideviceError").ToLocalChecked(), Number::New(isolate, error->idevice_error)).Check();
        if(error->error_message != NULL) {
            idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "errorMessage").ToLocalChecked(), String::NewFromUtf8(isolate, read_stream(error->error_message)).ToLocalChecked()).Check();
        } else {
            idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "errorMessage").ToLocalChecked(), String::NewFromUtf8(isolate, "").ToLocalChecked()).Check();
        }
        if(error->udid) {
            idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "udid").ToLocalChecked(), String::NewFromUtf8(isolate, read_stream(error->udid)).ToLocalChecked()).Check();
        } else {
            idevicePairErrorObj->Set(context, String::NewFromUtf8(isolate, "udid").ToLocalChecked(), String::NewFromUtf8(isolate, "").ToLocalChecked()).Check();
        }
    }

    void pair(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();
        Local<Function> callback = Local<Function>::Cast(args[1]);
        Local<Object> object = Local<Object>::Cast(args[0]);

        Local<Value> debug = object->Get(context, String::NewFromUtf8(isolate, "debug").ToLocalChecked()).ToLocalChecked();
        Local<Value> udid = object->Get(context, String::NewFromUtf8(isolate, "udid").ToLocalChecked()).ToLocalChecked();
        Local<Value> command = object->Get(context, String::NewFromUtf8(isolate, "command").ToLocalChecked()).ToLocalChecked();

        idevice_pair_options options = default_idevice_pair_options;
        if (debug->IsBoolean()) { options.debug = debug->BooleanValue(isolate); }
        if (udid->IsString()) { options.udid = ToCString(isolate, udid); }
        if (command->IsString()) { options.command = ToCString(isolate, command); }

        idevice_pair_error error = default_idevice_pair_error;
        error.udid = tmpfile();
        error.error_message = tmpfile();
        FILE *data = tmpfile();

        if(idevice_pair(options, &error, data) == 0) error.pair_error = PAIR_E_SUCCESS;

        Local<Object> idevicePairError = Object::New(isolate);
        pack_idevice_pair_error(isolate, context, idevicePairError, &error);
        const unsigned argc = 2;
        Local<Value> argv[argc] = { idevicePairError, String::NewFromUtf8(isolate, read_stream(data)).ToLocalChecked() };
        
        callback->Call(context, Null(isolate), argc, argv).ToLocalChecked();
    }

    void pack_devices_ids(Isolate* isolate, Local<Context> &context, Local<Object> &devicesObj, struct idevices_found *idevices) {
        Local<Array> usblist = Array::New(isolate);
        Local<Array> networklist = Array::New(isolate);
        for (int i = 0; i < idevices->usb.num_udids; i++) {
            usblist->Set(context, i, String::NewFromUtf8(isolate, idevices->usb.udids[i]).ToLocalChecked()).Check();
        }
        for (int i = 0; i < idevices->network.num_udids; i++) {
            networklist->Set(context, i, String::NewFromUtf8(isolate, idevices->network.udids[i]).ToLocalChecked()).Check();
        }

        devicesObj->Set(context, String::NewFromUtf8(isolate, "usblist").ToLocalChecked(), usblist).Check();
        devicesObj->Set(context, String::NewFromUtf8(isolate, "networklist").ToLocalChecked(), networklist).Check();
    }

    void id(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();
        Local<Function> callback = Local<Function>::Cast(args[1]);
        Local<Object> object = Local<Object>::Cast(args[0]);

        Local<Value> debug = object->Get(context, String::NewFromUtf8(isolate, "debug").ToLocalChecked()).ToLocalChecked();
        Local<Value> usblist = object->Get(context, String::NewFromUtf8(isolate, "usblist").ToLocalChecked()).ToLocalChecked();
        Local<Value> networklist = object->Get(context, String::NewFromUtf8(isolate, "networklist").ToLocalChecked()).ToLocalChecked();

        idevice_id_options options;
        options.debug = false;
        options.usblist = true;
        options.networklist = true;

        if (debug->IsBoolean()) { options.debug = debug->BooleanValue(isolate); }
        if (usblist->IsBoolean()) { options.usblist = usblist->BooleanValue(isolate); }
        if (networklist->IsBoolean()) { options.networklist = networklist->BooleanValue(isolate); }

        idevices_found idevices = {.usb = default_idevice_udids, .network = default_idevice_udids};

        id_error error = idevice_id(options, &idevices);

        Local<Object> devicesObj = Object::New(isolate);
        pack_devices_ids(isolate, context, devicesObj, &idevices);

        const unsigned argc = 2;
        Local<Value> argv[argc] = { Number::New(isolate, error), devicesObj };
        
        idevices_found_free(&idevices);
        callback->Call(context, Null(isolate), argc, argv).ToLocalChecked();
    }
}

void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "idevice_backup2", idevice_info_node::backup2);
    NODE_SET_METHOD(exports, "idevice_info", idevice_info_node::info);
    NODE_SET_METHOD(exports, "idevice_id", idevice_info_node::id);
    NODE_SET_METHOD(exports, "idevice_pair", idevice_info_node::pair);
}

NODE_MODULE(binding, Initialize);
