import { Receiver as V03Binary } from "./receiver_binary_0_3";
import { Receiver as V03Structured } from "./receiver_structured_0_3";
import { Receiver as V1Binary } from "./receiver_binary_1";
import { Receiver as V1Structured } from "./receiver_structured_1";
import { Constants as constants } from "./constants";

class HTTPReceiver {
  receivers: any;
  constructor() {
    this.receivers = {
      v1: {
        structured: new V1Structured(),
        binary: new V1Binary()
      },
      v03: {
        structured: new V03Structured(),
        binary: new V03Binary()
      }
    };
  }

  accept(headers, body) {
    const mode = getMode(headers);
    const version = getVersion(mode, headers, body);
    switch (version) {
      case constants.SPEC_V1:
        return this.receivers.v1[mode].parse(body, headers);
      case constants.SPEC_V03:
        return this.receivers.v03[mode].parse(body, headers);
      default:
        console.error(`Unknown spec version ${version}. Default to ${constants.SPEC_V1}`);
        return this.receivers.v1[mode].parse(body, headers);
    }
  }
}

function getMode(headers) {
  let mode = "binary";
  const contentType = headers[constants.HEADER_CONTENT_TYPE];
  if (contentType && contentType.startsWith(constants.MIME_CE)) {
    mode = "structured";
  }
  return mode;
}
// TODO Should have Spec instead of any
function getVersion(mode, headers, body: String | any) {
  let version = constants.SPEC_V1; // default to 1.0

  if (mode === "binary") {
    // Check the headers for the version
    const versionHeader = headers[constants.DEFAULT_SPEC_VERSION_HEADER];
    if (versionHeader) {
      version = versionHeader;
    }
  } else {
    // structured mode - the version is in the body
    version = body instanceof String ? JSON.parse(body.toString()).specversion : body.specversion;
  }
  return version;
}

export { HTTPReceiver };
