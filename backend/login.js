import validator from "validator";
import { userModel } from "./models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

export const validateLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userModel.findOne({ email: email });
  let isMatch;

  const validationErrors = [];

  if (!validator.isEmail(email)) {
    validationErrors.push({ error: "Invalid email format", type: "email" });
  }

  if (!user) {
    validationErrors.push({
      error: "Incorrect Email or Password",
      type: "generic",
    });
  }

  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
  }
  if (user && !isMatch) {
    validationErrors.push({
      error: "Incorrect Email or Password",
      type: "generic",
    });
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  } else {
    const token = createToken(user.userId);
    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });

    res.status(200).json({ message: "Validation Successful" });
    return;
  }
};
