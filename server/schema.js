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
  Socket_io_events: z
    .object({
      eventName: z.string(),
      sshPort: z.number(),
      contId: z.string(),
      defaultCont: z.boolean(),
    })
    .array(),
});

module.exports = { databaseSchema };
