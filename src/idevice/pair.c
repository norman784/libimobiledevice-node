#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#define TOOL_NAME "idevicepair"

#include "pair.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

static char *udid = NULL;

static void print_error_message(lockdownd_error_t lerr, struct idevice_pair_error *error)
{
	switch (lerr) {
		case LOCKDOWN_E_PASSWORD_PROTECTED:
			fprintf(error->error_message, "ERROR: Could not validate with device %s because a passcode is set. Please enter the passcode on the device and retry.\n", udid);
			fprintf(error->udid, "%s", udid);
			break;
		case LOCKDOWN_E_INVALID_HOST_ID:
			fprintf(error->error_message, "ERROR: Device %s is not paired with this host\n", udid);
			fprintf(error->udid, "%s", udid);
			break;
		case LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING:
			fprintf(error->error_message, "ERROR: Please accept the trust dialog on the screen of device %s, then attempt to pair again.\n", udid);
			fprintf(error->udid, "%s", udid);
			break;
		case LOCKDOWN_E_USER_DENIED_PAIRING:
			fprintf(error->error_message, "ERROR: Device %s said that the user denied the trust dialog.\n", udid);
			fprintf(error->udid, "%s", udid);
			break;
		default:
			fprintf(error->error_message, "ERROR: Device %s returned unhandled error code %d\n", udid, lerr);
			fprintf(error->udid, "%s", udid);
			break;
	}
}

int idevice_pair(struct idevice_pair_options options, struct idevice_pair_error *error, FILE *stream_out)
{
	lockdownd_client_t client = NULL;
	idevice_t device = NULL;
	error->idevice_error = IDEVICE_E_UNKNOWN_ERROR;
	error->lockdownd_error = LOCKDOWN_E_UNKNOWN_ERROR;
	int result;
	char *cmd = options.command;
	char *type = NULL;
	if(options.udid) udid = options.udid;

	typedef enum {
		OP_NONE = 0, OP_PAIR, OP_VALIDATE, OP_UNPAIR, OP_LIST, OP_HOSTID, OP_SYSTEMBUID
	} op_t;
	op_t op = OP_NONE;

	if (!strcmp(cmd, "pair")) {
		op = OP_PAIR;
	} else if (!strcmp(cmd, "validate")) {
		op = OP_VALIDATE;
	} else if (!strcmp(cmd, "unpair")) {
		op = OP_UNPAIR;
	} else if (!strcmp(cmd, "list")) {
		op = OP_LIST;
	} else if (!strcmp(cmd, "hostid")) {
		op = OP_HOSTID;
	} else if (!strcmp(cmd, "systembuid")) {
		op = OP_SYSTEMBUID;
	} else {
		fprintf(error->error_message, "ERROR: Invalid command '%s' specified\n", cmd);
		error->pair_error = PAIR_E_INVALID_COMMAND;
		exit(EXIT_FAILURE);
	}

	if (op == OP_SYSTEMBUID) {
		char *systembuid = NULL;
		userpref_read_system_buid(&systembuid);
		fprintf(stream_out, "%s", systembuid);

		if (systembuid)
			free(systembuid);

		return EXIT_SUCCESS;
	}

	if (op == OP_LIST) {
		unsigned int i;
		char **udids = NULL;
		unsigned int count = 0;
		userpref_get_paired_udids(&udids, &count);
		for (i = 0; i < count; i++) {
			fprintf(stream_out, "%s\n", udids[i]);
			free(udids[i]);
		}
		if (udids)
			free(udids);
		if (udid)
			free(udid);
		return EXIT_SUCCESS;
	}

	if (udid) {
		error->idevice_error = idevice_new(&device, udid);
		if (error->idevice_error != IDEVICE_E_SUCCESS) {
			fprintf(error->error_message, "No device found with udid %s, is it plugged in?\n", udid);
			fprintf(error->udid, "%s", udid);
			free(udid);
			udid = NULL;
			return EXIT_FAILURE;
		}
	} else {
		error->idevice_error = idevice_new(&device, NULL);
		if (error->idevice_error != IDEVICE_E_SUCCESS) {
			fprintf(error->error_message, "No device found, is it plugged in?\n");
			return EXIT_FAILURE;
		}
	}

	error->idevice_error = idevice_get_udid(device, &udid);
	if (error->idevice_error != IDEVICE_E_SUCCESS) {
		fprintf(error->error_message, "ERROR: Could not get device udid, error code %d\n", error->idevice_error);
		result = EXIT_FAILURE;
		goto leave;
	}

	if (op == OP_HOSTID) {
		plist_t pair_record = NULL;
		char *hostid = NULL;

		userpref_read_pair_record(udid, &pair_record);
		pair_record_get_host_id(pair_record, &hostid);

		fprintf(stream_out, "%s", hostid);

		if (hostid)
			free(hostid);

		if (pair_record)
			plist_free(pair_record);

		return EXIT_SUCCESS;
	}

	error->lockdownd_error = lockdownd_client_new(device, &client, TOOL_NAME);
	if (error->lockdownd_error != LOCKDOWN_E_SUCCESS) {
		idevice_free(device);
        fprintf(error->error_message, "ERROR: Could not connect to lockdownd, error code %d\n", error->lockdownd_error);
		return EXIT_FAILURE;
	}

	result = EXIT_SUCCESS;

	error->lockdownd_error = lockdownd_query_type(client, &type);
	if (error->lockdownd_error != LOCKDOWN_E_SUCCESS) {
		fprintf(error->error_message, "QueryType failed, error code %d\n", error->lockdownd_error);
		result = EXIT_FAILURE;
		goto leave;
	} else {
		if (strcmp("com.apple.mobile.lockdown", type)) {
			fprintf(error->error_message, "WARNING: QueryType request returned '%s'\n", type);
		}
		if (type) {
			free(type);
		}
	}

	switch(op) {
		default:
		case OP_PAIR:
		error->lockdownd_error = lockdownd_pair(client, NULL);
		if (error->lockdownd_error == LOCKDOWN_E_SUCCESS) {
			fprintf(stream_out, "%s", udid);
		} else {
			result = EXIT_FAILURE;
			print_error_message(error->lockdownd_error, error);
		}
		break;

		case OP_VALIDATE:
		lockdownd_client_free(client);
		client = NULL;
		error->lockdownd_error = lockdownd_client_new_with_handshake(device, &client, TOOL_NAME);
		if (error->lockdownd_error == LOCKDOWN_E_SUCCESS) {
			fprintf(stream_out, "%s", udid);
		} else {
			result = EXIT_FAILURE;
			print_error_message(error->lockdownd_error, error);
		}
		break;

		case OP_UNPAIR:
		error->lockdownd_error = lockdownd_unpair(client, NULL);
		if (error->lockdownd_error == LOCKDOWN_E_SUCCESS) {
			fprintf(stream_out, "%s", udid);
		} else {
			result = EXIT_FAILURE;
			print_error_message(error->lockdownd_error, error);
		}
		break;
	}

leave:
	lockdownd_client_free(client);
	idevice_free(device);
	if (udid) {
		free(udid);
	}
	return result;
}

