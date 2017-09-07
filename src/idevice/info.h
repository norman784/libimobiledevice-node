#include <iostream>

#ifndef idevice_info_h
#define idevice_info_h

#include <iostream>

using namespace std;

typedef function<void(string error, string output)> node_callback;

string read_stream(FILE *stream);

struct idevice_info_options {
    bool debug = false;
    bool simple = false;
    char *udid = NULL;
    char *domain = NULL;
    char *key = NULL;
};

void idevice_info(idevice_info_options options, node_callback callback);
void idevice_info_stream(idevice_info_options options, FILE *stream_err, FILE *stream_out);

#endif /* idevice_info_h */
