import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    return res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await userModel.findOne({ email });
    // checking is user already exist
    if (exist) {
      return res.json({ success: false, message: "User Already Exist" });
    }

    //validating email format and strong password

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

export { registerUser, loginUser };
