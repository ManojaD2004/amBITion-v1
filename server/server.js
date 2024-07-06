const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { databaseSchema } = require("./schema");
const { createDockerByUserId, deleteDockerByContId } = require("./docker");

const fs = require("fs");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

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
    const stdout = createDockerByUserId(
      req.params.userid,
      req.body.projectId,
      database.Docker_PORT + 1,
      database.Docker_PORT + 2
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
    database.Docker_PORT += 10;

    // writing db json
    fs.writeFileSync("./db/database.json", JSON.stringify(database), {
      encoding: "utf8",
    });
    console.log(database);

    res.status(201);
    res.send({ created: true, "docker-cont-id": stdout.trim() });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ created: false, "docker-cont-id": null });
  }
});

app.post("/delete/:userid/:contid", (req, res) => {
  try {
    // reading db
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
      return res.send({
        deleted: false,
        "docker-cont-id": null,
        message: "User Does not Exist!",
      });
    } else {
      let index = findUser.contIds.indexOf(req.params.contid);
      if (index == -1) {
        res.status(400);
        return res.send({
          deleted: false,
          "docker-cont-id": null,
          message: "Container Does not Exist!",
        });
      }
      findUser.contIds.splice(index, 1);
      findUser.prjIds.splice(index, 1);
    }


    // deleteing the container if exists
    const stdout = deleteDockerByContId(req.params.contid);
    // writing to db
    fs.writeFileSync("./db/database.json", JSON.stringify(database), {
      encoding: "utf8",
    });
    console.log(database);
    res.status(200);
    res.send({
      deleted: true,
      "docker-cont-id": stdout.trim(),
      message: "Container Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({
      deleted: false,
      "docker-cont-id": null,
      message: "Some Error Occured!",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
