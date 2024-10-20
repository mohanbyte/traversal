// Importing necessary modules
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const routes = require("./backend/routes/routes");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// MongoDB connection setup
mongoose
  .connect(
    "mongodb+srv://mohan:PmxOIHXdPVXJ1WXq@cluster0.cscwhhu.mongodb.net/backfront?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => {
    // Improved error logging for database connection issues
    console.error("Database connection failed:", error.message);
  });

// Middleware for parsing incoming JSON requests
app.use(bodyParser.json());

// CORS headers setup to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allows all origins
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" // Allow common HTTP methods
  );
  next(); // Move to the next middleware
});

// Enabling CORS for all routes
app.use(cors());

// Routing setup
app.use(routes);

// Setting the port for the application

const port = process.env.PORT || 3000;
// Starting the HTTP server on the defined port
app.set("port", port);
server.listen(port);

// Event listener for the 'listening' event
server.on("listening", () => {
  console.log(`Server is listening on port ${app.get("port")} ${port}`);
});

// Event listener for the 'error' event
server.on("error", onError);

function onError() {
  // Enhanced error handling with specific cases
  if (error.syscall !== "listen") {
    throw error; // Rethrow non-listen errors
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // Handling specific listen errors with custom messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1); // Exit the process with failure
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1); // Exit the process with failure
      break;
    default:
      throw error; // For other errors, rethrow
  }
}
