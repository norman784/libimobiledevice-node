//
//  main.cpp
//  test
//
//  Created by Norman Paniagua Spindler on 9/7/17.
//  Copyright © 2017 Tatakua. All rights reserved.
//

#include <iostream>
#include <libimobiledevice_node.h>

using namespace std;

void callback(string error, string data) {
    if (!error.empty()) fprintf(stderr, "ERROR: %s\n", error.c_str());
    fprintf(stdout, "DATA:\n\n %s\n", data.c_str());
}

int main(int argc, const char * argv[]) {
    idevice_info_options options;
    options.debug = true;
    options.simple = false;
    
    idevice_info(options, callback);
    fprintf(stdout, "\n\n===========\n\n\n");
//    idevice_info_stream(options, stderr, stdout);
}
