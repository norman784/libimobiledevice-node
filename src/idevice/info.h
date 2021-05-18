#ifndef info_h
#define info_h

#include <stdio.h>
#include <stdbool.h>
#include "common/common_binding.h"
#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>

struct idevice_info_options {
    bool debug;
    bool simple;
    char *udid;
    char *domain;
    char *key;
    bool network;
};

typedef enum {
    INFO_E_ESUCCESS = 0,
    INFO_E_INVALID_DOMAIN = -1,
    INFO_E_UNKOWN_ERROR = -2
} info_error;

struct idevice_info_error {
    info_error info_error;
    idevice_error_t idevice_error;
    lockdownd_error_t lockdownd_error;
    FILE *error_message;
} const default_idevice_info_error = { 
    .info_error = INFO_E_UNKOWN_ERROR,
    .idevice_error = IDEVICE_E_UNKNOWN_ERROR,
    .lockdownd_error = LOCKDOWN_E_UNKNOWN_ERROR,
    .error_message = NULL 
};

void idevice_info(struct idevice_info_options options, struct idevice_info_error* error, FILE *stream_out);

#endif /* info_h */
