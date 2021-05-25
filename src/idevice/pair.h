#ifndef pair_h
#define pair_h
#include <stdio.h>
#include <stdbool.h>
#include "common/userpref.h"
#include "common/common_binding.h"
#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>

typedef enum {
    PAIR_E_SUCCESS = 0,
    PAIR_E_INVALID_COMMAND = -1,
    PAIR_E_UNKOWN_ERROR = -2
} pair_error;

struct idevice_pair_options {
    bool debug;
    char *udid;
    char *command;
} const default_idevice_pair_options = {.debug = false, .udid = NULL, .command = NULL};

struct idevice_pair_success {
    bool success;
    FILE *message;
} const default_idevice_pair_success = { .success = false, .message = NULL };

struct idevice_pair_error {
    pair_error pair_error;
    idevice_error_t idevice_error;
    lockdownd_error_t lockdownd_error;
    FILE *udid;
    FILE *error_message;
} const default_idevice_pair_error = { 
    .pair_error = PAIR_E_UNKOWN_ERROR,
    .idevice_error = IDEVICE_E_UNKNOWN_ERROR,
    .lockdownd_error = LOCKDOWN_E_UNKNOWN_ERROR,
    .udid = NULL,
    .error_message = NULL 
};

int idevice_pair(struct idevice_pair_options options, struct idevice_pair_error *error, FILE *stream_out);
#endif /* pair_h */