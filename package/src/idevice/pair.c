#ifdef HAVE_CONFIG_H
#include <config.h>
#endif

#include "pair.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>

static char *udid = NULL;

static void print_error_message(lockdownd_error_t err, FILE *stream_err)
{
	switch (err) {
		case LOCKDOWN_E_PASSWORD_PROTECTED:
			fprintf(stream_err, "ERROR: Could not validate with device %s because a passcode is set. Please enter the passcode on the device and retry.\n", udid);
			break;
		case LOCKDOWN_E_INVALID_HOST_ID:
			fprintf(stream_err, "ERROR: Device %s is not paired with this host\n", udid);
			break;
		case LOCKDOWN_E_PAIRING_DIALOG_RESPONSE_PENDING:
			fprintf(stream_err, "ERROR: Please accept the trust dialog on the screen of device %s, then attempt to pair again.\n", udid);
			break;
		case LOCKDOWN_E_USER_DENIED_PAIRING:
			fprintf(stream_err, "ERROR: Device %s said that the user denied the trust dialog.\n", udid);
			break;
		default:
			fprintf(stream_err, "ERROR: Device %s returned unhandled error code %d\n", udid, err);
			break;
	}
}

int idevice_pair(char *cmd, FILE *stream_err, FILE *stream_out)
{
	printf("lets pair %s", cmd);
	lockdownd_client_t client = NULL;
	idevice_t device = NULL;
	idevice_error_t ret = IDEVICE_E_UNKNOWN_ERROR;
	lockdownd_error_t lerr;
	int result;

	char *type = NULL;
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
		fprintf(stream_err, "ERROR: Invalid command '%s' specified\n", cmd);
		exit(EXIT_FAILURE);
	}

	if (op == OP_SYSTEMBUID) {
		char *systembuid = NULL;
		userpref_read_system_buid(&systembuid);

		fprintf(stream_out, "%s\n", systembuid);

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
		ret = idevice_new(&device, udid);
		free(udid);
		udid = NULL;
		if (ret != IDEVICE_E_SUCCESS) {
			fprintf(stream_err, "No device found with udid %s, is it plugged in?\n", udid);
			return EXIT_FAILURE;
		}
	} else {
		ret = idevice_new(&device, NULL);
		if (ret != IDEVICE_E_SUCCESS) {
			fprintf(stream_err, "No device found, is it plugged in?\n");
			return EXIT_FAILURE;
		}
	}

	ret = idevice_get_udid(device, &udid);
	if (ret != IDEVICE_E_SUCCESS) {
		fprintf(stream_err, "ERROR: Could not get device udid, error code %d\n", ret);
		result = EXIT_FAILURE;
		goto leave;
	}

	if (op == OP_HOSTID) {
		plist_t pair_record = NULL;
		char *hostid = NULL;

		userpref_read_pair_record(udid, &pair_record);
		pair_record_get_host_id(pair_record, &hostid);

		fprintf(stream_out, "%s\n", hostid);

		if (hostid)
			free(hostid);

		if (pair_record)
			plist_free(pair_record);

		return EXIT_SUCCESS;
	}

	lerr = lockdownd_client_new(device, &client, "idevicepair");
	if (lerr != LOCKDOWN_E_SUCCESS) {
		idevice_free(device);
        fprintf(stream_err, "ERROR: Could not connect to lockdownd, error code %d\n", lerr);
		return EXIT_FAILURE;
	}

	result = EXIT_SUCCESS;

	lerr = lockdownd_query_type(client, &type);
	if (lerr != LOCKDOWN_E_SUCCESS) {
		fprintf(stream_err, "QueryType failed, error code %d\n", lerr);
		result = EXIT_FAILURE;
		goto leave;
	} else {
		if (strcmp("com.apple.mobile.lockdown", type)) {
			fprintf(stream_err, "WARNING: QueryType request returned '%s'\n", type);
		}
		if (type) {
			free(type);
		}
	}

	switch(op) {
		default:
		case OP_PAIR:
		lerr = lockdownd_pair(client, NULL);
		if (lerr == LOCKDOWN_E_SUCCESS) {
			fprintf(stream_out, "SUCCESS: Paired with device %s\n", udid);
		} else {
			result = EXIT_FAILURE;
			print_error_message(lerr, stream_err);
		}
		break;

		case OP_VALIDATE:
		lerr = lockdownd_validate_pair(client, NULL);
		if (lerr == LOCKDOWN_E_SUCCESS) {
			fprintf(stream_out, "SUCCESS: Validated pairing with device %s\n", udid);
		} else {
			result = EXIT_FAILURE;
			print_error_message(lerr, stream_err);
		}
		break;

		case OP_UNPAIR:
		lerr = lockdownd_unpair(client, NULL);
		if (lerr == LOCKDOWN_E_SUCCESS) {
			fprintf(stream_out, "SUCCESS: Unpaired with device %s\n", udid);
		} else {
			result = EXIT_FAILURE;
			print_error_message(lerr, stream_err);
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

