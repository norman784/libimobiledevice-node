#include "info.h"

#include "common/utils.h"
#include <string.h>
#include <stdlib.h>

#define TOOL_NAME "ideviceinfo"

static const char *domains[] = {
    "com.apple.disk_usage",
    "com.apple.disk_usage.factory",
    "com.apple.mobile.battery",
    /* FIXME: For some reason lockdownd segfaults on this, works sometimes though
     "com.apple.mobile.debug",. */
    "com.apple.fmip",
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

static int is_domain_known(char *domain)
{
    int i = 0;
    while (domains[i] != NULL) {
        if (strstr(domain, domains[i++])) {
            return 1;
        }
    }
    return 0;
}

void set_idevice_info_error_success(struct idevice_info_error *error) {
    error->info_error = INFO_E_ESUCCESS;
    error->idevice_error = IDEVICE_E_SUCCESS;
    error->lockdownd_error = LOCKDOWN_E_SUCCESS;
    error->error_message = NULL;
}

void idevice_info(struct idevice_info_options options, struct idevice_info_error* error, FILE *stream_out) {
    lockdownd_client_t client = NULL;
    lockdownd_error_t ldret = LOCKDOWN_E_UNKNOWN_ERROR;
    idevice_t device = NULL;
    idevice_error_t ret = IDEVICE_E_UNKNOWN_ERROR;
    plist_t node = NULL;
    const char* udid = NULL;
    int use_network = 0;
    char *domain = NULL;
    char *key = NULL;
    int simple = 0;
    char *xml_doc = NULL;
    uint32_t xml_length;
    
    if (options.debug) idevice_set_debug_level(1);
    if (options.network) use_network = 1;
    if (options.domain) {
        if (!is_domain_known(options.domain)) {
            fprintf(error->error_message, "WARNING: Sending query with unknown domain \"%s\".\n", options.domain);
            error->info_error = INFO_E_INVALID_DOMAIN;
            return;
        }
        domain = options.domain;
    }
    if (options.key) key = options.key;
    if (options.simple) simple = 1;
    if (options.udid) udid = options.udid;
    
    ret = idevice_new_with_options(&device, udid, (use_network) ? IDEVICE_LOOKUP_NETWORK : IDEVICE_LOOKUP_USBMUX);

    if (ret != IDEVICE_E_SUCCESS) {
        if (udid) fprintf(error->error_message, "No device found with udid %s, is it plugged in?\n", udid);
        else fprintf(error->error_message, "No device found, is it plugged in?\n");
        error->idevice_error = ret;
        return;
    }

    if (LOCKDOWN_E_SUCCESS != (ldret = simple ?
                               lockdownd_client_new(device, &client, TOOL_NAME):
                               lockdownd_client_new_with_handshake(device, &client, TOOL_NAME))) {
        fprintf(error->error_message, "ERROR: Could not connect to lockdownd: %s (%d)\n", lockdownd_strerror(ldret), ldret);
        error->lockdownd_error = ldret;
        idevice_free(device);
        return;
    }

    if(lockdownd_get_value(client, domain, key, &node) == LOCKDOWN_E_SUCCESS) {
        plist_to_xml(node, &xml_doc, &xml_length);
		fprintf(stream_out, "%s", xml_doc);
		free(xml_doc);
        plist_free(node);
    }
    
    if (domain != NULL) free(domain);
    lockdownd_client_free(client);
    idevice_free(device);
    set_idevice_info_error_success(error);
}
