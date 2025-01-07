import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { resetPassInProgress } from "../forgetPass.js";

dotenv.config();

export const verifyResTk = async (req, res) => {
  const token = req.cookies.forgetpassToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const check = await resetPassInProgress(decoded.id);
      if (check) {
        res.status(200).json({ valid: true, email: check.email });
        return;
      }
    } catch (err) {
      res.status(400).json({ valid: false, error: "Invalid Token" });
      return;
    }
  }
  res.status(404).json({ valid: false, error: "No Token" });
  return;
};
