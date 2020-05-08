const Constants = require("./constants.js");
const Spec = require("../../specs/spec_0_3.js");
const JSONParser = require("../../formats/json/parser.js");

const StructuredHTTPReceiver = require("./receiver_structured.js");

const jsonParserSpec = new JSONParser();

const parserByMime = {};
parserByMime[Constants.MIME_JSON] = jsonParserSpec;
parserByMime[Constants.MIME_CE_JSON] = jsonParserSpec;

const allowedContentTypes = [];
allowedContentTypes.push(Constants.MIME_CE_JSON);

const setterByAttribute = {};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.TYPE] = {
  name: "type",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.SPEC_VERSION] = {
  name: "specversion",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.SOURCE] = {
  name: "source",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.ID] = {
  name: "id",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.TIME] = {
  name: "time",
  parser: v => new Date(Date.parse(v))
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.SCHEMA_URL] = {
  name: "schemaurl",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.CONTENT_ENCONDING] = {
  name: "dataContentEncoding",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.CONTENT_TYPE] = {
  name: "dataContentType",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.SUBJECT] = {
  name: "subject",
  parser: v => v
};
setterByAttribute[Constants.STRUCTURED_ATTRS_03.DATA] = {
  name: "data",
  parser: v => v
};

// Leaving this in place for now. TODO: fixme
// eslint-disable-next-line
function Receiver(configuration = undefined) {
  this.receiver = new StructuredHTTPReceiver(parserByMime, setterByAttribute, allowedContentTypes, Spec);
}

Receiver.prototype.check = function (payload, headers) {
  this.receiver.check(payload, headers);
};

Receiver.prototype.parse = function (payload, headers) {
  return this.receiver.parse(payload, headers);
};

export { Receiver };
