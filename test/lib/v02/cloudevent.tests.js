/*!
 * cloudevents.io
 * Apache-2.0 Licensed
 */

"use strict";

const expect     = require("chai").expect;
const CloudEvent = require("../../../lib/v02/cloudevent.js");

describe("CloudEvent for v0.2", () => {
  describe("Object constraints", () => {
    it("should throw error when 'extensions'", () = {

    });
  });

  describe("Context Attributes", () => {
    it("should return the 'id' value", () => {
      // setup
      let ce = new CloudEvent("0x1", "src", "type.evt", new Map());

      // act
      let actual = ce.id();

      // assert
      expect("0x1").to.equal(actual);
    });
  });
});
