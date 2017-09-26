#include "common_binding.h"
#include <stdlib.h>

char* read_stream(FILE *stream) {
    long lSize;
    char *buffer;
    
    fseek(stream, 0L, SEEK_END);
    lSize = ftell(stream);
    rewind(stream);
    
    buffer = calloc(1, lSize+1);
    
    fread(buffer, lSize, 1, stream);
    
    fflush(stream);
    
    return buffer;
}
