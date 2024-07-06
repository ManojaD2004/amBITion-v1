const { z } = require("zod");

const databaseSchema = z.object({
  "Docker-PORT": z.number(),
  "Docker-PORT-list": z.number().array(),
});

module.exports = { databaseSchema };
