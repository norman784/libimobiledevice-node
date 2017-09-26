#ifndef common_binding_h
#define common_binding_h

#include <stdio.h>

typedef void (*node_callback)(char* error, char* output);
typedef void (*node_progress_callback)(FILE*);

char* read_stream(FILE *stream);

#endif /* common_binding_h */
