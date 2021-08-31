#ifndef backup2_hpp
#define backup2_hpp

#include <stdio.h>
#include <stdbool.h>
#include "common/common_binding.h"


struct idevice_backup2_backup_options {
    bool full;
};

struct idevice_backup2_restore_options {
    bool system;
    bool reboot;
    bool copy;
    bool settings;
    bool remove;
    bool skip_apps;
    char *password;
};

struct idevice_backup2_encryption_options {
    bool enable;
    char *password;
};

struct idevice_backup2_changepw_options {
    char *newpw;
    char *backup_password;
};

struct idevice_backup2_cloud_options {
    bool enable;
};

struct idevice_backup2_options {
    bool debug;
    char *udid;
    char *source;
    bool network;
    char *command;
    struct idevice_backup2_backup_options backup;
    struct idevice_backup2_restore_options restore;
    struct idevice_backup2_encryption_options encryption;
    struct idevice_backup2_changepw_options changepw;
    struct idevice_backup2_cloud_options cloud;
    bool interactive;
    char *backup_directory;
};

extern const struct idevice_backup2_options default_idevice_backup2_options;

void idevice_backup2(struct idevice_backup2_options options, FILE *stream_err, FILE *stream_out, node_progress_callback progress_callback);

#endif /* backup2_hpp */
