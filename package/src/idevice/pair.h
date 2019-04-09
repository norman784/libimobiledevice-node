#ifndef pair_h
#define pair_h
#include <stdio.h>
#include <stdbool.h>
#include "common/userpref.h"
#include "common/common_binding.h"

int idevice_pair(char *cmd, FILE *stream_err, FILE *stream_out);
#endif /* pair_h */