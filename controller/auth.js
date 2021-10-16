const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHander = require("../util/async");
const ErrorResponse = require("../util/errorResponce");
const Employee = require("../model/employee");
const { sendTokenResponse } = require("./employee");
const mailSender = require("../util/mailSender");
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
//LOGIN
exports.login = asyncHander(async (req, res, next) => {
  //validating email and password not empty
  const { email, password, confirmed } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("please provide email and password", 400));
  }
  //validating email exist in databse
  const employee = await Employee.findOne({ email }).select("+password");
  if (!employee) {
    return next(new ErrorResponse("invalid credentials", 401));
  }
  //comparing enterd password with the one from database
  const isExist = await employee.comparePassord(password);
  if (!isExist) {
    return next(new ErrorResponse("invalid credentails", 401));
  }
  //  validating if account is confirmed account
  if (!employee.confirmed) {
    return next(
      new ErrorResponse(
        "your account is not confirmed. please check your email and confirm it.",
        401
      )
    );
  }
  //sending jwt into cookie
  sendTokenResponse(employee, 200, res);
});
exports.forgetPassword = asyncHander(async (req, res, next) => {
  const { email } = req.body;
  const isExist = await Employee.findOne({ email });
  const status = "resetPassword";
  //validating if email exist
  if (!isExist) {
    return next(new ErrorResponse("there is no account with that email", 404));
  }
  try {
    const resetPasswordLink = `${process.env.APPLICATION_URL}/authentication/resetPassword/${isExist._id}`;
    await mailSender(req.body, resetPasswordLink, isExist.posiotion, status);
    res.status(200).json({
      success: true,
      message: "please check your email to resetPassword",
    });
  } catch (error) {
    console.log("email sending error: " + error);
    return next(new ErrorResponse("could not send email", 500));
  }
});
exports.resetPassword = asyncHander(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new ErrorResponse("employee not found", 404));
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);
    const updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: req.params.id },
      { password: newPassword }
    );
    if (!updatedEmployee) {
      return next(new ErrorResponse("error while reseting password", 500));
    }
    res.status(200).json({
      success: true,
      message:
        "password reseted successfuly, you can now login with new password.",
    });
  } catch (error) {
    console.log("please provide new password: " + error);
  }
});
