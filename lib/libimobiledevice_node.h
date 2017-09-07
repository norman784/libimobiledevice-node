//
//  libimobiledevice_node.h
//  libimobiledevice-node
//
//  Created by Norman Paniagua Spindler on 9/7/17.
//  Copyright © 2017 Tatakua. All rights reserved.
//

#ifndef libimobiledevice_node_h
#define libimobiledevice_node_h

#include <iostream>

using namespace std;

typedef function<void(string error, string output)> node_callback;

struct idevice_info_options {
    bool debug;
    bool simple;
    char *udid;
    char *domain;
    char *key;
};

void idevice_info(idevice_info_options options, node_callback callback);
void idevice_info_stream(idevice_info_options options, FILE *stream_err, FILE *stream_out);

#endif /* libimobiledevice_node_h */
