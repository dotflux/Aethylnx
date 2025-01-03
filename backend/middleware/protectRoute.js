import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res) => {
  const token = req.cookies.userToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded) {
        return res.status(400).json({ valid: false, error: "Invalid Token" });
      }
      const user = await userModel.findOne({ userId: decoded.id });
      if (!user) {
        return res.status(404).json({ valid: false, error: "User not found" });
      }
      req.user = user;
      res.status(200).json({ valid: true, message: "Valid user token" });
      return;
    } catch (err) {
      res.status(400).json({ valid: false, error: "Invalid Token" });
      return;
    }
  }
  res.status(404).json({ valid: false, error: "No Token" });
  return;
};
