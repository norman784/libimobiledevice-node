/*
 * ideviceinfo.cc
 * Simple utility to show information about an attached device
 *
 * Copyright (c) 2009 Martin Szulecki All Rights Reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include <node.h>
#include <string.h>

extern "C" {
  #include <libimobiledevice/libimobiledevice.h>
  #include <libimobiledevice/lockdown.h>
  #include "common/utils.h"
}

using v8::Handle;
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::String;
using v8::Object;
using v8::Array;
using v8::Value;
using v8::Function;
using v8::Null;

#define FORMAT_KEY_VALUE 1
#define FORMAT_XML 2

static const char *domains[] = {
	"com.apple.disk_usage",
	"com.apple.disk_usage.factory",
	"com.apple.mobile.battery",
/* FIXME: For some reason lockdownd segfaults on this, works sometimes though
	"com.apple.mobile.debug",. */
	"com.apple.iqagent",
	"com.apple.purplebuddy",
	"com.apple.PurpleBuddy",
	"com.apple.mobile.chaperone",
	"com.apple.mobile.third_party_termination",
	"com.apple.mobile.lockdownd",
	"com.apple.mobile.lockdown_cache",
	"com.apple.xcode.developerdomain",
	"com.apple.international",
	"com.apple.mobile.data_sync",
	"com.apple.mobile.tethered_sync",
	"com.apple.mobile.mobile_application_usage",
	"com.apple.mobile.backup",
	"com.apple.mobile.nikita",
	"com.apple.mobile.restriction",
	"com.apple.mobile.user_preferences",
	"com.apple.mobile.sync_data_class",
	"com.apple.mobile.software_behavior",
	"com.apple.mobile.iTunes.SQLMusicLibraryPostProcessCommands",
	"com.apple.mobile.iTunes.accessories",
	"com.apple.mobile.internal", /**< iOS 4.0+ */
	"com.apple.mobile.wireless_lockdown", /**< iOS 4.0+ */
	"com.apple.fairplay",
	"com.apple.iTunes",
	"com.apple.mobile.iTunes.store",
	"com.apple.mobile.iTunes",
	NULL
};

static int is_domain_known(char *domain) {
	int i = 0;
	while (domains[i] != NULL) {
		if (strstr(domain, domains[i++])) {
			return 1;
		}
	}
	return 0;
}

static void throw_exception(Isolate *isolate, Local<Function> callback, Local<String> error) {
  Handle<Value> res[2];
  res[0] = error;
  res[1] = Null(isolate);

  callback->Call(Null(isolate), 2, res);
}

void device_info(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.Length() == 0) {
    isolate->ThrowException(Exception::TypeError(
      String::NewFromUtf8(isolate, "Provide at least a callback")
    ));
    return;
  }

  Local<Array> params = Array::New(isolate);
  Local<Function> callback;

  if (args[0]->IsArray()) {
    params = Local<Array>::Cast(args[0]);
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

  uint32_t i;
  lockdownd_client_t client = NULL;
	lockdownd_error_t ldret = LOCKDOWN_E_UNKNOWN_ERROR;
	idevice_t device = NULL;
	idevice_error_t ret = IDEVICE_E_UNKNOWN_ERROR;
	int simple = 0;
	int format = FORMAT_KEY_VALUE;
	const char* udid = NULL;
	char *domain = NULL;
	char *key = NULL;
	char *xml_doc = NULL;
	uint32_t xml_length;
	plist_t node = NULL;

  for (i = 0; i < params->Length(); i++) {
    String::Utf8Value tmp(params->Get(i)->ToString());
    char *str = (char*)(*tmp);

    if (!strcmp(str, "-d") || !strcmp(str, "--debug")) {
      idevice_set_debug_level(1);
      continue;
    }
    else if (!strcmp(str, "-u") || !strcmp(str, "--udid")) {
			i++;
			if (!str || (strlen(str) != 40)) {
        throw_exception(isolate, callback, String::NewFromUtf8(isolate, "The udid must have 40 chars"));
        return;
			}
			udid = str;
			continue;
		}
		else if (!strcmp(str, "-q") || !strcmp(str, "--domain")) {
			i++;
			if (!str || (strlen(str) < 4)) {
        throw_exception(isolate, callback, String::NewFromUtf8(isolate, "The domain must have at least 4 chars"));
				return;
			}
			if (!is_domain_known(str)) {
        throw_exception(isolate, callback,
          String::Concat(
            String::NewFromUtf8(isolate, "Sending query with unknown domain"),
            String::NewFromUtf8(isolate, str)
          )
        );
        return;
			}
			domain = strdup(str);
			continue;
		}
		else if (!strcmp(str, "-k") || !strcmp(str, "--key")) {
			i++;
			if (!str || (strlen(str) <= 1)) {
        throw_exception(isolate, callback, String::NewFromUtf8(isolate, "The key must containt at least one char"));
				return;
			}
			key = strdup(str);
			continue;
		}
		else if (!strcmp(str, "-x") || !strcmp(str, "--xml")) {
			format = FORMAT_XML;
			continue;
		}
		else if (!strcmp(str, "-s") || !strcmp(str, "--simple")) {
			simple = 1;
			continue;
		}
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
			switch (format) {
			case FORMAT_XML:
				plist_to_xml(node, &xml_doc, &xml_length);
				printf("%s", xml_doc);
				free(xml_doc);
				break;
			case FORMAT_KEY_VALUE:
				plist_print_to_stream(node, stdout);
				break;
			default:
				if (key != NULL)
					plist_print_to_stream(node, stdout);
			break;
			}
			plist_free(node);
			node = NULL;
		}
	}

	if (domain != NULL)
		free(domain);
	lockdownd_client_free(client);
	idevice_free(device);

  Handle<Value> res[2];
  res[0] = Null(isolate);
  res[1] = String::NewFromUtf8(isolate, "stdout");

  callback->Call(Null(isolate), 2, res);
}
