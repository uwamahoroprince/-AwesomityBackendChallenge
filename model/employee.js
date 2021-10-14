const mongoose = require("mongoose");

const Employee = new mongoose.Schema({
  code: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    require: [true, "please provide employee name is required"],
    trim: true,
  },
  nationalId: {
    type: String,
    require: [true, "please provide national-id is required"],
    trim: true,
  },

  phoneNumber: {
    type: String,
    require: [true, "please provide Phone number is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email is required"],
    // unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  dateOfBirth: {
    type: Date,
    // required: [true, "please provide date of birth is required"],
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
  },
  position: {
    type: String,
    enum: ["MANAGER", "DEVELOPER", "DESIGNER", "TESTER", "DEVOPS"],
    default: "MANAGER",
  },
  password: {
    type: String,
    required: [true, "Please provide password is required"],
    minlength: 6,
    select: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
//VALIDATING BEFORE SAVING
Employee.pre("save", function (next) {
  //generating ranom number and apply it to code
  const initialValue = "EMP";
  min = Math.ceil(1000);
  max = Math.floor(10000);
  const number = Math.floor(Math.random() * (max - min) + min);
  const generatedCode = initialValue + number;
  this.code = generatedCode;
  next();
});
module.exports = mongoose.model("employee", Employee);
