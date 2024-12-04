const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  emailId: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
