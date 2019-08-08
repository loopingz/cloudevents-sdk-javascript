/*!
 * cloudevents.io
 * Apache-2.0 Licensed
 */

"use strict";

/**
 * Builder prototype
 */
function Builder() {

}

Builder.prototype.withId = (id) => {

  return this;
};

Builder.prototype.withSource = (source) => {

  return this;
};

Builder.prototype.withSpecversion = (specversion) => {

  return this;
};

Builder.prototype.withType = (type) => {

  return this;
};

Builder.prototype.withExtensions = (extensions) => {

  return this;
};

/**
 * Builds a brand new immutable instance of CloudEvent.
 * @return {CloudEvent}
 * @public
 */
Builder.prototype.build = () => {

};

module.exports = Builder;
