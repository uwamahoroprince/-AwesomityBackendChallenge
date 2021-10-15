const mongoose = require("mongoose");
const textSearch = require("mongoose-partial-full-search");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
Employee.plugin(textSearch);
Employee.index({ "$**": "text" });
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
//HASHING PASSWORD
Employee.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//CREATING TOKEN
Employee.methods.getSignedJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//PASSWORD COMPARE
Employee.methods.comparePassord = async function (enterdPassword) {
  return bcrypt.compare(enterdPassword, this.password);
};
module.exports = mongoose.model("employee", Employee);
