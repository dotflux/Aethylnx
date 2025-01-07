import { userModel } from "./models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

export const changeDisplayname = async (req, res) => {
  const userId = req.body.id;
  const newDisplayname = req.body.displayname;
  const user = await userModel.findOne({ userId: userId });

  const validationErrors = [];

  if (newDisplayname.trim() === "" && newDisplayname !== "") {
    validationErrors.push({
      error: "Display name cannot be only spaces",
      type: "displayName",
    });
  }

  if (!user) {
    return res.status(500).json({ valid: false, message: "Invalid User Id" });
  }

  if (newDisplayname == user.displayName) {
    validationErrors.push({
      error: "New name cannot be the same as old",
      type: "displayName",
    });
  }

  if (newDisplayname > 16) {
    validationErrors.push({
      error: "Name exceeds characters limit of 16",
      type: "displayName",
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
          return res.status(401).json({ valid: false, error: "Invalid Token" });
        }
        if (userId !== decoded.id) {
          return res
            .status(500)
            .json({ valid: false, message: "Invalid User Id" });
        }
        user.displayName = newDisplayname;
        user.save();
        res.status(200).json({ message: "Change Successful" });
        return;
      } catch (error) {
        console.log(`error changing display name: ${error}`);
      }
    }
  }
};
