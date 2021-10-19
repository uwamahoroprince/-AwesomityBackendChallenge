const jwt = require("jsonwebtoken");
const asyncHander = require("../util/async");
const ErrorResponse = require("../util/errorResponce");
const Employee = require("../model/employee");

//PROTECT ROUTES
exports.protected = asyncHander(async (req, res, next) => {
  let token;
  //getting token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //getting token from cookies
  // else if(req.cookies.token){
  //     token = req.cookies.token;
  // }

  //MAKE SURE TOKEN EXIST
  if (!token) {
    return next(
      new ErrorResponse("you are not authorized to access this route", 401)
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.employee = await Employee.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new ErrorResponse("you are not  authorized to access this route", 401)
    );
  }
});
