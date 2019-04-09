#ifndef backup2_hpp
#define backup2_hpp

#include <stdio.h>
#include <stdbool.h>
#include "common/common_binding.h"

struct idevice_backup2_options_changepw {
    char *newpw;
    char *backup_password;
};

struct idevice_backup2_options_enciptation {
    char *status;
    char *password;
};

struct idevice_backup2_options {
    bool debug;
    char *udid;
    char *source;
    bool backup;
    bool restore;
    bool system;
    bool reboot;
    bool copy;
    bool settings;
    bool remove;
    char *password;
    char *cloud;
    bool full;
    bool info;
    bool list;
    bool unback;
    struct idevice_backup2_options_enciptation encryption;
    struct idevice_backup2_options_changepw changepw;
    bool interactive;
    char *backup_directory;
};

void idevice_backup2(struct idevice_backup2_options options, FILE *stream_err, FILE *stream_out, node_progress_callback progress_callback);

#endif /* backup2_hpp */
