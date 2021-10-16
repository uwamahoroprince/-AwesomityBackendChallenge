const express = require("express");
const dotenv = require("dotenv");
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");
const app = express();
const dbConnection = require("./config/db");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");

//IMPORTING ROUTES
const employee = require("./routes/employee");
const authentication = require("./routes/auth");

//DEFINING MIDDLEWARES//
// Body parser
app.use(express.json());
//cookie-Parser
app.use(cookieParser());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

//EXECUTING ROUTES MIDDLEWARE
app.use("/api/employee", employee);
app.use("/api/authentication", authentication);

//CONNECTING TO MONGODB DATABASE
dbConnection();

//LOADING DOTENV FILE
dotenv.config({ path: "./config/config.env" });
//error handler
app.use(errorHandler);
//DEFINING APPLICATION PORT
const PORT = process.env.PORT;
//RUNNING APPLICATION END-POINTS

app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} on http://localhost:${PORT}`
  );
});
