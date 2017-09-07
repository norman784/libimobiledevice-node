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
#include <map>

typedef std::map<char, char> idevice_info_options;

void idevice_info(idevice_info_options options);

#endif /* libimobiledevice_node_h */
