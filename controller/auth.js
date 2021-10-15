const asyncHander = require("../util/async");
const ErrorResponse = require("../util/errorResponce");
const jwt = require("jsonwebtoken");
const Employee = require("../model/employee");
exports.confirmAccount = asyncHander(async (req, res, next) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
  const isExist = await Employee.findById(decoded.id);
  console.log(isExist);
  if (!isExist) {
    return next(
      new ErrorResponse(
        "token is invalid or account dose not exist. please try to register again",
        400
      )
    );
  } else {
    try {
      if (isExist.confirmed) {
        return next(new ErrorResponse("Account have confirmed before", 400));
      } else {
        const employee = await Employee.findByIdAndUpdate(
          { _id: decoded.id },
          { confirmed: true }
        );
        if (employee) {
          res.status(200).json({
            success: true,
            message: "congrats!!! your account is now confirmed",
          });
        }
      }
    } catch (error) {
      return next(
        new ErrorResponse("error accure while confirming your account", 400)
      );
    }
  }
});
