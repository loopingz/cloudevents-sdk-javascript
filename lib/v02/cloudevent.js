/*!
 * cloudevents.io
 * Apache-2.0 Licensed
 */

"use strict";

/**
 * CloudEvent prototype
 *
 * @example
 * let event = new CloudEvent("A234-1234-1234", "https://github.com/cloudevents/spec/pull", "com.github.pull.create", {
 *     "comexampleextension1" : "value",
 *     "comexampleextension2" : {
 *         "othervalue" : 5
 *     }
 * });
 *
 * @constructor
 * @class
 * @param {String} id - Identifies the event
 * @param {String} source - Identifies the context in which an event happened
 * @param {String} type - The originating occurrence
 * @param {Object} extensions - Custom additional context attributes

 * @param {Object} data - Data attribute
 * @public
 */
function CloudEvent(id, source, type, extensions, data) {

}

CloudEvent.prototype.id = () => {

};

CloudEvent.prototype.source = () => {

};

/**
 * The CloudEvents Spec version
 * @public
 * @return {String} Always set to '0.2'
 */
CloudEvent.prototype.specversion = () => {
  return "0.2";
};

CloudEvent.prototype.type = () => {

};

CloudEvent.prototype.get = (extension) => {

};

CloudEvent.prototype.data = (data) => {

};

/**
 * Returns the internal representation of context attributes, extension
 * attribute and data attribute.
 *
 * @example
 * let event = new CloudEvent("A234-1234-1234", "https://github.com/cloudevents/spec/pull", "com.github.pull.create");
 * event
 *   .then((payload) => {
 *     // use the event payload, which is valid
 *     payload.id;
 *     payload.source;
 *     payload.specversion;
 *   })
 *   .catch((err) => {
 *     // threat the err reporting an invalid payload
 *   });
 *
 * @return {Promise} To resolve the event as object notation
 * @public
 */
CloudEvent.prototype.asObject = () => {

};

/**
 * Validates the payload against the definitions, but if something
 * is wrong throws and exception.
 *
 */
CloudEvent.prototype.validate = () => {

};

module.exports = CloudEvent;
