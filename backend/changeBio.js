import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

export const changeBio = async (req, res) => {
  const userId = req.body.id;
  const newBio = req.body.bio;
  const user = await userModel.findOne({ userId: userId });

  const validationErrors = [];

  if (!user) {
    return res.status(500).json({ valid: false, message: "Invalid User Id" });
  }

  if (newBio == user.bio) {
    validationErrors.push({
      error: "Error saving: No change detected",
      type: "bio",
    });
  }

  if (newBio.length > 350) {
    validationErrors.push({
      error: "Bio exceeds characters limit of 350",
      type: "bio",
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
            .status(501)
            .json({ valid: false, message: "Invalid User Id" });
        }
        user.bio = newBio;
        user.save();
        res
          .status(200)
          .json({ message: "Change Successful", changedBio: user.bio });
        return;
      } catch (error) {
        console.log(`error changing username: ${error}`);
      }
    }
  }
};
