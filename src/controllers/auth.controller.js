const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

exports.Signup = async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    //create db object
    const userObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    };
    //save user
    const user = new User(userObj);
    const savedUser = await user.save();
    //generate and return jwt token
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    return res
      .status(200)
      .json({ message: "User Added successfully!", data: savedUser });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ error: error?.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send("Missing required fields!");
    }
    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    return res
      .status(200)
      .json({ success: true, msg: "Login successfull!", user: user });
  } catch (error) {
    return res.status(500).json({ error: `Interna error, ${error?.message}` });
  }
};
