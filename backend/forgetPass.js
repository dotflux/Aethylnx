import validator from "validator";
import { userModel } from "./models/userModel.js";
import { passReset } from "./models/resetPass.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateOTP from "./otpgen.js";
import sendEmail from "./mailer.js";

dotenv.config();

export const resetPassInProgress = async (id) => {
  const user = await passReset.findOne({ userId: id });
  return user || null;
};

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: "5m" });
};

export const validatePassReset = async (req, res) => {
  const otp = generateOTP();
  const email = req.body.email;
  const user = await userModel.findOne({ email: email });
  const inProcess = await passReset.findOne({ email: email });

  const validationErrors = [];
  if (!user) {
    validationErrors.push({
      error: "This email is not registered",
      type: "email",
    });
  }
  if (inProcess) {
    validationErrors.push({
      error: "This email is already in this process",
      type: "email",
    });
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  } else {
    const dummy = new passReset({
      email: email,
      otp: otp,
      userId: user.userId,
    });
    await dummy.save();
    const token = createToken(user.userId);
    res.cookie("forgetpassToken", token, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
      secure: false,
    });

    sendEmail(
      email,
      "Reset Password, Aethylnx",
      `Here is your one time password to reset your password ${otp}, CAUTION: IF this action was not requested by you refrain from sharing this`
    );

    res.status(200).json({ message: "Validation Successful" });
    return;
  }
};

export const validatePassResetOtp = async (req, res) => {
  const validationErrors = [];
  const email = req.body.email;
  const newPass = req.body.newPass;
  const rePass = req.body.rePass;

  if (!email) {
    res.status(500).json({ error: "Authentication failed" });
    return;
  }
  const user = await passReset.findOne({ email: email });

  if (!user) {
    res.status(500).json({ error: "Incorrect Email" });
    return;
  }

  if (req.body.otp != user.otp) {
    validationErrors.push({ error: "Incorrect Otp", type: "otp" });
  }

  const fields = [
    { field: "passwordNew", value: newPass, minLength: 8, maxLength: 12 },
    { field: "passwordRe", value: rePass }, // No min/max length for email
    { field: "otp", value: req.body.otp },
  ];

  // Loop through fields to check for empty fields and length validation
  fields.forEach(({ field, value, minLength, maxLength }) => {
    if (validator.isEmpty(value)) {
      validationErrors.push({ error: "This field is required", type: field });
    } else if (
      minLength &&
      maxLength &&
      !validator.isLength(value, { min: minLength, max: maxLength })
    ) {
      validationErrors.push({
        error: `This field must be between ${minLength} and ${maxLength} characters`,
        type: field,
      });
    }
  });

  if (newPass != rePass) {
    validationErrors.push({
      error: "The passwords don't match",
      type: "passwordRe",
    });
  }

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  if (newPass == rePass && req.body.otp == user.otp) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPass, saltRounds);
    await userModel.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
    await passReset.deleteOne({ email: email });
    res.clearCookie("forgetpassToken");
    res.status(200).json({ message: "Registration Successful" });
    return;
  }
};
