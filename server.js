const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const routes = require("./backend/routes/routes");
const server = http.createServer(app);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Acces-Control-Allow-Origin", "*");
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
