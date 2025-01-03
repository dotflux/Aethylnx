import validator from "validator";
import {userModel} from './models/userModel.js'
import {dummyUsers} from './models/dummyUser.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import sendEmail from './mailer.js'
import generateOTP from "./otpgen.js";

dotenv.config();


const createToken = (userId) => {
  return jwt.sign({id:userId},process.env.SECRET_KEY,{expiresIn:'5m'})
}

export const verifyInProgress = async (id) => {
  const user = await dummyUsers.findOne({userId:id})
  return user || null;
}

const handleSubmission = async(userName,userPassword,userEmail,id) => {
  const user = new userModel({username:userName,password:userPassword,email:userEmail,userId:id});
  await user.save()
};

export const validate = async (req, res) => {
  const otp = generateOTP();
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await userModel.findOne({username:username})
  const existingEmail = await userModel.findOne({email:email})
  const existingDummy = await dummyUsers.findOne({email:email})

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password,saltRounds)

  const validationErrors = [];

  if (!validator.isEmail(email)) {
    validationErrors.push({ error: "Invalid email format", type: "email" });
  }

  if (existingUser) {
    validationErrors.push({ error: "Username is taken", type: "username" });
  }

  if (existingEmail) {
    validationErrors.push({ error: "Email is in use", type: "email" });
  }

  if (existingDummy) {
    validationErrors.push({ error: "Email is under authentication please wait 5 minutes", type: "email" });
  }

  const fields = [
    { field: "username", value: username, minLength: 5, maxLength: 10 },
    { field: "password", value: password, minLength: 8, maxLength: 12 },
    { field: "email", value: email }, // No min/max length for email
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
        error: `${field} must be between ${minLength} and ${maxLength} characters`,
        type: field,
      });
    }
  });

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return
  }
  else {
    const dummy = new dummyUsers({username:username,email:email,password:hashedPassword,otp:otp})
    await dummy.save()
    const token = createToken(dummy.userId)
    res.cookie("signupToken",token,{
    httpOnly:true,
    maxAge:5*60*1000,
    secure:false
    })
    sendEmail(email,"Account Creation, Aethylnx",`Here is your One Time Password for creating your account: ${otp}`)

    res.status(200).json({'message':"Validation Successful"})
    return
  }
  
  
};

export const verifyOtp = async (req,res) =>{
  const validationErrors = [];
  const email = req.body.email
  if (!email){
    res.status(500).json({error:"Authentication failed"})
    return
  }
  const user = await dummyUsers.findOne({email:email})

  if (!user){
    res.status(500).json({error:"Incorrect Email"})
    return
  }

  if (req.body.otp != user.otp) {
    validationErrors.push({ error: "Incorrect Otp", type: "otp" });
  }

  if (validator.isEmpty(req.body.otp)) {
    validationErrors.push({ error: "This field is required", type:"otp" });
  }

  if (validationErrors.length > 0) {
    res.status(400).json({ errors: validationErrors });
    return
  }

  if (req.body.otp == user.otp){
    await handleSubmission(user.username,user.password,user.email,user.userId);
    await dummyUsers.deleteOne({email:email})
    res.clearCookie("signupToken")
    res.status(200).json({message:"Registration Successful"})
    return
  }
  
}