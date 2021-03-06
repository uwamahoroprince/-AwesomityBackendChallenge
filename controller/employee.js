const reader = require("xlsx");
const asyncHander = require("../util/async");
const ErrorResponse = require("../util/errorResponce");
const Employee = require("../model/employee");
const mailSender = require("../util/mailSender");
let token = "";
//  @desc CREATE AN EMPLOYEE
//  @routes /api/employee
//  @method POST
exports.createEmployee = asyncHander(async (req, res, next) => {
  const { email, phoneNumber, nationalId, dateOfBirth } = req.body;
  const isExist = await Employee.findOne({ email });

  //VALIDATIONS//
  //validating nationalID
  if (nationalId.length !== 16) {
    return next(
      new ErrorResponse(
        "could not complete. nationalId must be 16 integers",
        400
      )
    );
  }
  //validating phoneNumber
  if (!phoneNumber.startsWith("+250") || phoneNumber.length != 13) {
    return next(
      new ErrorResponse("could not complete. phoneNumber must be rwandan", 400)
    );
  }
  //validating how old -> not under 18 years old
  const yearsOld =
    new Date(new Date(Date.now()).getFullYear()) -
    new Date(dateOfBirth).getFullYear();
  if (yearsOld < 18) {
    return next(
      new ErrorResponse(
        "could not complete. under 18 employees are not allowed",
        400
      )
    );
  }

  // make sure email dose not exist then create new employee and send email to validate new account
  if (isExist) {
    return next(
      new ErrorResponse("sorry! there is an account with email", 400)
    );
  } else {
    try {
      const employee = await Employee.create(req.body);
      if (!employee) {
        return next(new ErrorResponse("could not register an employee", 400));
      }
      if (employee.position === "MANAGER") {
        //SENDING JWT INTO COOKIE
        sendTokenResponse(employee, 200, res);
        const confirmURL = `${process.env.APPLICATION_URL}/authentication/${token}`;
        await mailSender(req.body, confirmURL, employee.position);
      } else {
        await mailSender(req.body);
        res.status(201).json({
          success: true,
          message: `${employee.position} ${employee.name} successfuly registerd`,
          data: employee,
        });
      }
    } catch (error) {
      console.log("email sending error: " + error);
      return next(new ErrorResponse("could not send email", 500));
    }
  }
});

//  @desc GET ALL EMPLOYEES
//  @routes /api/employee
//  @method SEARCH (this is from mongoose-partial-full-search third party imported in Employee model)
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
//  @routes /api/suspend/employee/id
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
//  @routes /api/activate/employee/id
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
//  @desc SEARCH AN EMPLOYEES
//  @routes /api/employee/id
//  @method PATCH
exports.searchAnEmployee = asyncHander(async (req, res, next) => {
  const { name, email, position, code, phoneNumber } = req.body;
  const employee = await Employee.search(
    email || name || position || phoneNumber || code,
    function (err, output) {
      if (err)
        return next(
          new ErrorResponse("an error accure while searching an employee", 400)
        );
    }
  );
  if (!employee) {
    return next(new ErrorResponse("couldent search", 400));
  } else if (employee.length === 0) {
    return next(new ErrorResponse("employee not found", 404));
  } else {
    res.status(200).json({
      success: true,
      message: "employee found successfuly",
      data: employee,
    });
  }
});

//  @desc UPLOAD EMPLOYEES
//  @routes /api/employee/upload/
//  @method POST
exports.createEmployeeFromFileUpload = asyncHander(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse("please provide excel file", 400));
  }
  // creating custom file name
  const initialValue = "File";
  min = Math.ceil(1000);
  max = Math.floor(10000);
  const number = Math.floor(Math.random() * (max - min) + min);
  const generatedCode = initialValue + number;
  const excelFile = req.files.excelFile;
  const fileName = `${generatedCode}-${excelFile.name}`;
  //defining path to file

  const pathToFile = `${process.env.FILE_UPLOAD}/${fileName}`;
  //uploading file
  await excelFile.mv(pathToFile);

  // Reading uploaded file
  const file = reader.readFile(pathToFile);
  let data = [];
  const sheets = file.SheetNames;
  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      data.push(res);
    });
  }
  //CREATING EMPLOYEES FROM FILE
  try {
    for (const key in data) {
      const employee = await Employee.create(data[key]);
      if (!employee) {
        return next(new ErrorResponse("could not register an employee", 400));
      }

      await mailSender(employee);
    }
    res.status(201).json({
      success: true,
      count: data.length,
      msg: `${data.length} employees from excel file have created successfuly`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse("could not send email", 500));
  }
});
//METHOD TO SEND TOKEN RESPONCE
const sendTokenResponse = (employee, statusCode, res) => {
  token = employee.getSignedJWT();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //ENABLELING HTTPS ONLY IN PRODUCTION
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message:
      "account successfuly created!!! please chech your Email to confirm your account",
    data: employee,
    token,
  });
};
exports.sendTokenResponse = sendTokenResponse;
