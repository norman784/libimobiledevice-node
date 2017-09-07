CC=g++
LIB_NAME=imobiledevice_node
INC=../dependencies/inclide
LIB=../dependencies/lib
# LIBS=-L$(LIB) -limobiledevice -lplist
#
# output: libimobiledevice_node.o common/utils.o
# 	$(CC) -c -fPIC *.o -o libimobiledevice_node.o
# 	$(CC) -g $(INCLUDE) -shared -WI,-imobiledevice_node,libimobiledevice_node.1 -o $(LIB)libimobiledevice_node.dylib $(LIBS)
#
# libimobiledevice_node.o: libimobiledevice_node.cpp libimobiledevice_node.h common/utils.h common/utils.c
# 	$(CC) *.cpp *.h common/*.c
#

output:
	$(CC) -Wall -fPIC -c *.cpp common/*.c
	ld -dylib -o $(LIB)/lib$(LIB_NAME).1.dylib *.o -I$(INC) -L$(LIB) -limobiledevice -lplist

clean:
		rm *.o
