#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include "id.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "common/debug.h"
#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>

#define MODE_NONE 0
#define MODE_SHOW_ID 1
#define MODE_LIST_DEVICES 2

const struct idevice_udids default_idevice_udids = { NULL, 0 };

id_error handle_new_device(struct idevice_udids* device_udids,const idevice_info_t *_dev_list, const int dev_index) {
    int n_udids = device_udids->num_udids;
    if (device_udids->num_udids == 0) {
        device_udids->udids = (char **) malloc(sizeof(char*));
        if(device_udids->udids == NULL) {
            printf("ERROR: Can't malloc new memory in rows\n");
            return ID_E_CANNOT_MALLOC_MEMORY;
        }
        device_udids->udids[n_udids] = (char*) malloc(SIZE_UDID * sizeof(char));
        if(device_udids->udids[n_udids] == NULL) {
            printf("ERROR: Can't malloc new memory in columns\n");
            return ID_E_CANNOT_MALLOC_MEMORY;
        }
    } else {
        int new_row_size = n_udids + 1;
        char **rows = (char **) realloc(device_udids->udids, new_row_size * sizeof(char*));
        if (rows == NULL) {
            printf("ERROR: Can't reallocate new memory in rows\n");
            return ID_E_CANNOT_REALLOC_MEMORY;
        }
        device_udids->udids = rows;
        device_udids->udids[n_udids] = (char *) malloc(SIZE_UDID * sizeof(char));
        if(device_udids->udids[n_udids] == NULL) {
            printf("Fatal error memory not reallocatedallocated\n");
            return ID_E_CANNOT_MALLOC_MEMORY;
        }
    }
    strncpy(device_udids->udids[n_udids], _dev_list[dev_index]->udid, SIZE_UDID);
    device_udids->num_udids++;
    return ID_E_ESUCCESS;
}


id_error idevice_id(struct idevice_id_options options, struct idevices_found *devices_found) {
    devices_found->usb = default_idevice_udids;
    devices_found->network = default_idevice_udids;
	idevice_info_t *_dev_list = NULL;
	int max_devices;

    if (options.debug) {
        idevice_set_debug_level(1);
    }

    if (idevice_get_device_list_extended(&_dev_list, &max_devices) < 0) {
        return ID_E_CANNOT_RETRIEVE_DEVICE_LIST;
	}

    for (int dev_index = 0; dev_index < max_devices; dev_index++) {
        if(_dev_list[dev_index]->conn_type == CONNECTION_USBMUXD && options.usblist) {
           id_error error = handle_new_device(&devices_found->usb, _dev_list, dev_index);
           if (error < 0) return error;
        }
        if(_dev_list[dev_index]->conn_type == CONNECTION_NETWORK && options.networklist) {
            id_error error = handle_new_device(&devices_found->network, _dev_list, dev_index);
            if (error < 0) return error;
        }
    }

    idevice_device_list_extended_free(_dev_list);
    return ID_E_ESUCCESS;
}

void idevice_udids_free(struct idevice_udids *devices_udids) {
    if(devices_udids->udids) {
        for(int i = 0; i < devices_udids->num_udids; i++) {
            free(devices_udids->udids[i]);
        }
        free(devices_udids->udids);
    }
}

void idevices_found_free(struct idevices_found *devices_found) {
    idevice_udids_free(&devices_found->usb);
    idevice_udids_free(&devices_found->network);
}
