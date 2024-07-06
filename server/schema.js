const { z } = require("zod");

const databaseSchema = z.object({
  Docker_PORT: z.number(),
  Docker_Users: z
    .object({
      username: z.string(),
      contIds: z.string().array(),
      prjIds: z.string().array(),
    })
    .array(),
});

module.exports = { databaseSchema };
