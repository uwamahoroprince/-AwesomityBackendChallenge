const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnection = require("./config/db");
const errorHandler = require("./middleware/error");

//IMPORTING ROUTES
const employee = require("./routes/employee");

//DEFINING MIDDLEWARES//
// Body parser
app.use(express.json());
//error handler
app.use(errorHandler);

//EXECUTING ROUTES MIDDLEWARE
app.use("/api/employee", employee);

//CONNECTING TO MONGODB DATABASE
dbConnection();

//LOADING DOTENV FILE
dotenv.config({ path: "./config/config.env" });

//DEFINING APPLICATION PORT
const PORT = process.env.PORT;

//RUNNING APPLICATION END-POINTS
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} on http://localhost:${PORT}`
  );
});
