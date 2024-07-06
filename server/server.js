const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { databaseSchema } = require("./schema");
const {
  createDockerByUserId,
  deleteDockerByContId,
  createDockerCiCdVersion,
} = require("./docker");
const socketIO = require("socket.io");

const fs = require("fs");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
let server = require("http").createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const SSHClient = require("ssh2").Client;

app.get("/home", (req, res) => {
  res.send("Hello Tiger!!");
});

app.post("/create/:userid/dockerinstance", (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.userid);

    // reading database json
    const databaseString = fs.readFileSync("./db/database.json", {
      encoding: "utf-8",
    });
    const database = databaseSchema.parse(JSON.parse(databaseString));

    // creating docker instance
    const metrics = {
      memory: req.body.memory,
      storage: req.body.storage,
      cpus: req.body.cpus,
    };
    const stdout = createDockerByUserId(
      req.params.userid,
      req.body.projectId,
      database.Docker_PORT + 1,
      database.Docker_PORT + 2,
      metrics
    );

    // editing db json
    const findUser = database.Docker_Users.find(
      (ele) => ele.username == req.params.userid
    );
    if (findUser == undefined) {
      database.Docker_Users.push({
        username: req.params.userid,
        contIds: [stdout.trim()],
        prjIds: [req.body.projectId.trim()],
      });
    } else {
      findUser.contIds.push(stdout.trim());
      findUser.prjIds.push(req.body.projectId);
    }

    // adding socket io event name with ports
    database.Socket_io_events.push({
      eventName: req.params.userid + "_" + req.body.projectId,
      sshPort: database.Docker_PORT + 2,
      contId: stdout.trim(),
      defaultCont: true,
    });
    // incrementing port value for next container
    database.Docker_PORT += 10;

    // writing db json
    fs.writeFileSync("./db/database.json", JSON.stringify(database), {
      encoding: "utf8",
    });
    console.log("Docker Instance Created!");
    res.status(201);
    res.send({ created: true, dockerContId: stdout.trim() });
  } catch (error) {
    console.log(error);
    res.status(500);
    console.log("Some Error Has Occured!");
    console.log(error);
    res.send({ created: false, dockerContId: null });
  }
});

app.post("/create/:userid/cicdinstance", (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.userid);

    // reading database json
    const databaseString = fs.readFileSync("./db/database.json", {
      encoding: "utf-8",
    });
    const database = databaseSchema.parse(JSON.parse(databaseString));

    // creating docker instance
    const stdout = createDockerCiCdVersion(
      req.params.userid,
      req.body.projectId,
      database.Docker_PORT + 1,
      req.body.githubLink
    );

    // editing db json
    const findUser = database.Docker_Users.find(
      (ele) => ele.username == req.params.userid
    );
    if (findUser == undefined) {
      database.Docker_Users.push({
        username: req.params.userid,
        contIds: [stdout.trim()],
        prjIds: [req.body.projectId.trim()],
      });
    } else {
      findUser.contIds.push(stdout.trim());
      findUser.prjIds.push(req.body.projectId);
    }

    // adding socket io event name with ports
    database.Socket_io_events.push({
      eventName: req.params.userid + "_" + req.body.projectId,
      sshPort: database.Docker_PORT + 2,
      contId: stdout.trim(),
      defaultCont: false,
    });
    // incrementing port value for next container
    database.Docker_PORT += 10;

    // writing db json
    fs.writeFileSync("./db/database.json", JSON.stringify(database), {
      encoding: "utf8",
    });
    console.log("Docker Instance Created!");
    res.status(201);
    res.send({ created: true, dockerContId: stdout.trim() });
  } catch (error) {
    console.log(error);
    res.status(500);
    console.log("Some Error Has Occured!");
    console.log(error);
    res.send({ created: false, dockerContId: null });
  }
});

app.post("/delete/:userid/:contid", (req, res) => {
  try {
    // reading db
    console.log(
      `User ${req.params.userid} request for deleting container ${req.params.contid}`
    );
    const databaseString = fs.readFileSync("./db/database.json", {
      encoding: "utf-8",
    });
    const database = databaseSchema.parse(JSON.parse(databaseString));

    // finding user
    const findUser = database.Docker_Users.find(
      (ele) => ele.username == req.params.userid
    );
    if (findUser == undefined) {
      res.status(400);
      console.log("User Does not Exist!");
      return res.send({
        deleted: false,
        dockerContId: null,
        message: "User Does not Exist!",
      });
    } else {
      let index = findUser.contIds.indexOf(req.params.contid);
      if (index == -1) {
        res.status(400);
        console.log("Container Does not Exist!");
        return res.send({
          deleted: false,
          dockerContId: null,
          message: "Container Does not Exist!",
        });
      }
      findUser.contIds.splice(index, 1);
      findUser.prjIds.splice(index, 1);
    }

    // deleteing the container if exists
    const stdout = deleteDockerByContId(req.params.contid);

    // delete event name of socket io
    let index = database.Socket_io_events.map((ele) => ele.eventName).indexOf(
      req.body.projectId
    );
    database.Socket_io_events.splice(index, 1);

    // writing to db
    fs.writeFileSync("./db/database.json", JSON.stringify(database), {
      encoding: "utf8",
    });
    console.log("Deleted " + stdout.trim());
    res.status(200);
    res.send({
      deleted: true,
      dockerContId: stdout.trim(),
      message: "Container Deleted Successfully!",
    });
  } catch (error) {
    res.status(500);
    console.log("Some Error Occured!");
    console.log(error);
    res.send({
      deleted: false,
      dockerContId: null,
      message: "Some Error Occured!",
    });
  }
});

app.get("/getinstances/:userid", (req, res) => {
  try {
    // reading database json
    const databaseString = fs.readFileSync("./db/database.json", {
      encoding: "utf-8",
    });
    const database = databaseSchema.parse(JSON.parse(databaseString));
    const eventNames = database.Socket_io_events;
    const resEvents = [];
    for (let i = 0; i < eventNames.length; i++) {
      if (eventNames[i].eventName.includes(req.params.userid)) {
        resEvents.push({
          prjId: eventNames[i].eventName,
          avaPorts: [eventNames[i].sshPort - 1, eventNames[i].sshPort],
          contId: eventNames[i].contId,
          defaultCont: eventNames[i].defaultCont,
        });
      }
    }
    res.status(200);
    console.log(`Returning User ${req.params.userid} Instances!`);
    res.send({
      gotten: true,
      resEvents: resEvents,
      message: "Given the User Events!",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({
      gotten: false,
      resEvents: null,
      message: "Some Error Occured!!",
    });
  }
});

io.on("connection", function (socket) {
  console.log("Connection Done!");
  // reading db
  const databaseString = fs.readFileSync("./db/database.json", {
    encoding: "utf-8",
  });
  const database = databaseSchema.parse(JSON.parse(databaseString));
  const eventNames = database.Socket_io_events;

  // getting event id
  const eventId = socket.handshake.query.termID;
  console.log(eventId);
  let portNumberSSH = eventNames.map((ele) => ele.eventName).indexOf(eventId);
  if (portNumberSSH == -1) {
    return socket.emit(
      `data-${eventId}`,
      "\r\n*** Container Does not Exists: ***\r\n"
    );
  }
  let conn = new SSHClient();
  conn
    .on("ready", function () {
      socket.emit(
        `data-${eventId}`,
        "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n"
      );
      conn.shell(function (err, stream) {
        if (err) {
          return socket.emit(
            `data-${eventId}`,
            "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
          );
        }
        socket.on(`data-${eventId}`, function (data) {
          stream.write(data);
        });
        stream
          .on("data", function (d) {
            socket.emit(`data-${eventId}`, d.toString("binary"));
            // console.log(d.toString("binary"));
          })
          .on("close", function () {
            conn.end();
          });
      });
    })
    .on("close", function () {
      socket.emit(`data-${eventId}`, "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    })
    .on("error", function (err) {
      socket.emit(
        `data-${eventId}`,
        "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
      );
    })
    .connect({
      host: "10.10.10.154",
      username: "admin",
      password: "1234",
      port: 2002,
    });
});

server.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
