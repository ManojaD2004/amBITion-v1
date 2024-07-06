const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { databaseSchema } = require("./schema");
const { createDockerByUserId } = require("./createdocker");

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
    const databaseString = fs.readFileSync("./db/database.json", {
      encoding: "utf-8",
    });
    const database = databaseSchema.parse(JSON.parse(databaseString));
    console.log(database);
    const stdout = createDockerByUserId(
      req.params.userid,
      req.body.project - id
    );
    res.status(201);
    res.send({ created: true, "docker-cont-id": stdout.trim() });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send("Sorry");
  }
});

app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
