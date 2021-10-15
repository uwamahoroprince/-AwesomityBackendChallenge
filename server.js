const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnection = require("./config/db");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");

//IMPORTING ROUTES
const employee = require("./routes/employee");
const confirmAccount = require("./routes/auth");

//DEFINING MIDDLEWARES//
// Body parser
app.use(express.json());
//cookie-Parser
app.use(cookieParser());

//EXECUTING ROUTES MIDDLEWARE
app.use("/api/employee", employee);
app.use("/api/confirmAccount", confirmAccount);

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
