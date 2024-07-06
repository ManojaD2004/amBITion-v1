const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

app.get("/home", (req, res) => {
  res.send("Hello Tiger!!");
});

app.post("/create/:userid/dockerinstance", (req,res) => {
    console.log(req.body);
    res.status(201);
    res.send("Created");
})

app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
