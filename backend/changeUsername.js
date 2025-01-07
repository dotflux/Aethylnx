import { userModel } from "./models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

export const changeUsername = async (req, res) => {
  const userId = req.body.id;
  const newUsername = req.body.username;
  const password = req.body.password;
  const user = await userModel.findOne({ userId: userId });
  let isMatch;

  const validationErrors = [];

  if (!newUsername || validator.isEmpty(newUsername)) {
    validationErrors.push({
      error: "Field required",
      type: "username",
    });
  }

  if (!validator.isAlphanumeric(newUsername)) {
    validationErrors.push({
      error: "Username must contain only letters and numbers (no spaces)",
      type: "username",
    });
  }

  if (newUsername.length < 5 || newUsername.length > 10) {
    validationErrors.push({
      error: "Username must be between 5 and 10 characters",
      type: "username",
    });
  }

  if (!user) {
    return res.status(500).json({ valid: false, message: "Invalid User Id" });
  }

  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
  }
  if (user && !isMatch) {
    validationErrors.push({
      error: "Incorrect Password",
      type: "password",
    });
  }

  if (newUsername == user.username) {
    validationErrors.push({
      error: "New username cannot be the same as old",
      type: "username",
    });
  }

  const existingUsername = await userModel.findOne({ username: newUsername });

  if (newUsername !== user.username && existingUsername) {
    validationErrors.push({
      error: "This username is under use",
      type: "username",
    });
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  } else {
    const token = req.cookies.userToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
          return res.status(400).json({ valid: false, error: "Invalid Token" });
        }
        if (userId !== decoded.id) {
          return res
            .status(500)
            .json({ valid: false, message: "Invalid User Id" });
        }
        user.username = newUsername;
        user.save();
        res.status(200).json({ message: "Change Successful" });
        return;
      } catch (error) {
        console.log(`error changing username: ${error}`);
      }
    }
  }
};
