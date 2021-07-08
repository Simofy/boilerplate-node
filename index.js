const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const data = require("./data.json");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const appPort = 3003;

app.use(express.static(__dirname + "/public"));

app.listen(appPort, () => {
  console.log(`Server online on port ${appPort}`);
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed
  next();
});

app.get("/api/data", (req, res) => {
  res.json(data);
});

MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
  const db = client.db("dummy-db");
  const dataCollection = db.collection("data");
  dataCollection.insertOne({
    createAt: new Date(),
  });
  app.get("/api/data-from-db", async (req, res) => {
    res.json(await dataCollection.find({}).toArray());
  });
});
