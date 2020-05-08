class Base64Parser {
  decorator: any;

  constructor(decorator) {
    this.decorator = decorator;
  }

  parse(payload) {
    let payloadToParse = payload;
    if (this.decorator) {
      payloadToParse = this.decorator.parse(payload);
    }

    return Buffer.from(payloadToParse, "base64").toString();
  }
}

export { Base64Parser };
