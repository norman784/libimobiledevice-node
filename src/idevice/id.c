#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>

#define MODE_NONE 0
#define MODE_SHOW_ID 1
#define MODE_LIST_DEVICES 2

void idevice_id(FILE *stream_out) {
    char **dev_list = NULL;
    int i;
    
    idevice_set_debug_level(1);

    if (idevice_get_device_list(&dev_list, &i) < 0) {
        fprintf(stream_out, "");
        return;
    }
    for (i = 0; dev_list[i] != NULL; i++) {
        fprintf(stream_out, "%s\n", dev_list[i]);
    }
    idevice_device_list_free(dev_list);
}
