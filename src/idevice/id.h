#ifndef id_h
#define id_h

#include <stdio.h>
#include <stdbool.h>
#include "common/common_binding.h"
#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>
#define SIZE_UDID 41

typedef enum {
    ID_E_ESUCCESS = 0,
    ID_E_CANNOT_RETRIEVE_DEVICE_LIST = -1,
    ID_E_CANNOT_MALLOC_MEMORY = -2,
    ID_E_CANNOT_REALLOC_MEMORY = -3,
} id_error;

struct idevice_id_options {
    bool debug;
    bool usblist;
    bool networklist;
};

struct idevice_udids {
    char **udids;
    int num_udids;
} const default_idevice_udids = { .udids = NULL, .num_udids = 0 };

struct idevices_found {
    struct idevice_udids usb;
    struct idevice_udids network;
};

id_error handle_new_device(struct idevice_udids* device_udids, const idevice_info_t *_dev_list, const int i);
id_error idevice_id(struct idevice_id_options options, struct idevices_found* devices_found);
void idevices_found_free(struct idevices_found *devices_found);

#endif /* id_h */
