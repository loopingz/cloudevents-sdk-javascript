/* eslint-disable no-console */

const express = require("express");
const { Receiver, DiscoveryService } = require("cloudevents-sdk");

const app = express();
const receiver = new Receiver();

app.use((req, res, next) => {
  let data = "";

  req.setEncoding("utf8");
  req.on("data", function (chunk) {
    data += chunk;
  });

  req.on("end", function () {
    req.body = data;
    next();
  });
});

DiscoveryService.registerService({
  url: "https://example.com/services/widgetService",
  name: "com.example.services.widgetService",
  specversions: ["1.0"],
  subscriptionurl: "https://events.example.com",
  protocols: ["HTTP"],
  types: [
    {
      type: "com.example.widget.create",
    },
    {
      type: "com.example.widget.delete",
    },
  ],
});
DiscoveryService.registerService({
  url: "https://example.com/services/catService",
  name: "com.example.services.catService",
  specversions: ["1.0"],
  subscriptionurl: "https://cats.example.com",
  protocols: ["HTTP"],
  types: [
    {
      type: "com.example.cats.buy",
    },
    {
      type: "com.example.cats.adopt",
    },
    {
      type: "com.example.cats.feed",
    },
    {
      type: "com.example.cats.give",
    },
    {
      // Just to play with discovery service
      type: "com.example.widget.create",
    },
  ],
});

DiscoveryService.express(app);
// Create a anonymous mapping of cloud events for example
DiscoveryService.express(app, "/anonymous", (name, type, req) => {
  // A true life example would have only one call to express and check req for permission
  // Only give access to the catService and widgetCreate if anonymous
  return name === "com.example.widget.create" || name === "com.example.services.catService";
});

app.post("/", function (req, res) {
  console.log("HEADERS", req.headers);
  console.log("BODY", req.body);

  try {
    const event = receiver.accept(req.headers, req.body);
    console.log(`Accepted event: ${event}`);
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(415).header("Content-Type", "application/json").send(JSON.stringify(err));
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
