#ifndef info_h
#define info_h

#include <stdio.h>
#include <stdbool.h>
#include "common/common_binding.h"

struct idevice_info_options {
    bool debug;
    bool simple;
    char *udid;
    char *domain;
    char *key;
};

void idevice_info(struct idevice_info_options options, FILE *stream_err, FILE *stream_out);

#endif /* info_h */
