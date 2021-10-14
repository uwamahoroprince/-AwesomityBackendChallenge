const asyncHander = require("../util/async");
const ErrorResponse = require("../util/errorResponce");
const Employee = require("../model/employee");

//  @desc CREATE AN EMPLOYEE
//  @routes /api/employee
//  @method POST
exports.createEmployee = asyncHander(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  if (!employee) {
    return next(new ErrorResponse("Employee not created", 400));
  } else {
    res.status(201).json({
      success: true,
      message: "employee created successfully",
      data: employee,
    });
  }
});

//  @desc GET ALL EMPLOYEES
//  @routes /api/employee
//  @method GET
exports.getAllEmployees = asyncHander(async (req, res, next) => {
  const employees = await Employee.find({});
  if (!employees) {
    return next(new ErrorResponse("Error while getting employees", 400));
  } else {
    res.status(200).json({
      success: true,
      count: employees.length,
      message: "employees found successfuly",
      data: employees,
    });
  }
});

//  @desc EDIT AN EMPLOYEES
//  @routes /api/employee/id
//  @method PUT
exports.updateEmployee = asyncHander(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );
  if (!employee) {
    return next(new ErrorResponse("Employee not Edited", 400));
  } else {
    res.status(200).json({
      success: true,
      message: "employees edited successfuly",
      data: employee,
    });
  }
});

//  @desc DELETE AN EMPLOYEES
//  @routes /api/employee/id
//  @method DELETE
exports.deleteEmplyee = asyncHander(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    return next(
      new ErrorResponse(
        "employee you are trying to delete does not exist ",
        404
      )
    );
  } else {
    res.status(200).json({
      success: true,
      message: "employee deleted successfuly",
      data: {},
    });
  }
});

//  @desc SUSPEND AN EMPLOYEES
//  @routes /api/employee/id
//  @method PATCH
exports.suspendEmployee = asyncHander(async (req, res, next) => {
  const foundEmployee = await Employee.findById(req.params.id);
  const employee = await Employee.findByIdAndUpdate(
    { _id: req.params.id },
    { status: req.body.status },
    { new: true }
  );
  if (!foundEmployee) {
    return next(
      new ErrorResponse(
        "employee you are trying to suspend does not exist ",
        404
      )
    );
  } else if (foundEmployee.status === "INACTIVE") {
    return next(new ErrorResponse("this employee is already suspended ", 400));
  } else {
    res.status(200).json({
      success: true,
      message: "employee suspended successfuly",
      data: employee,
    });
  }
});

//  @desc ACTIVATE AN EMPLOYEES
//  @routes /api/employee/id
//  @method PATCH
exports.activateEmployee = asyncHander(async (req, res, next) => {
  const foundEmployee = await Employee.findById(req.params.id);
  const employee = await Employee.findByIdAndUpdate(
    { _id: req.params.id },
    { status: req.body.status },
    { new: true }
  );
  if (!foundEmployee) {
    return next(
      new ErrorResponse(
        "employee you are trying to activate does not exist ",
        404
      )
    );
  } else if (foundEmployee.status === "ACTIVE") {
    return next(new ErrorResponse("this employee is already ACTIVATED ", 400));
  } else {
    res.status(200).json({
      success: true,
      message: "employee suspended successfuly",
      data: employee,
    });
  }
});
