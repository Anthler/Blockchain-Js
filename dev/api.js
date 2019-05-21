const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/blockchain", (req, res) => {});

app.post("/transaction", (req, res) => {
  res.send("Yay it works!");
});

app.get("/mine", (req, res) => {});

app.listen(3000, () => {
  console.log("SERVER RUNNING ON PORT: 3000");
});
