const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const routes = require("./backend/routes/routes");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://mohan:PmxOIHXdPVXJ1WXq@cluster0.cscwhhu.mongodb.net/backfront?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(cors());

app.use(routes);
app.set("port", 3000);

server.listen(3000);

server.on("listening", (port) => {
  console.log("Listening");
});

server.on("error", (error) => {
  console.log(error);
});
