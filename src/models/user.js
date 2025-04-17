const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [4, "Passwrod msut be at least 4 characters long"],
    },
    age: {
      type: Number,
      min: [18, "Age must be above 18"],
      max: [99, "Age cannot exceed 99"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      message: "Gender must be of 'male','female', or 'others'",
      required: true,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: function (url) {
          // Accept URLs starting with http/https and optionally ending with image extensions
          const regex = /^(https?:\/\/.*(\.(?:png|jpg|jpeg|svg|webp))?)$/;
          return regex.test(url);
        },
        message: "Photo URL must be a valid image URL",
      },
    },
    about: {
      type: String,
      default: "This is the default about of the user",
      maxlength: [500, "About must not exceed 500 characters"],
    },
    skills: {
      type: [String],
      validate: {
        validator: (skills) => Array.isArray(skills) && skills.length <= 10,
        message: "Skills cannot exceed 10 items",
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = JWT.sign({ _id: user._id }, "SECRET@JWT@123", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
