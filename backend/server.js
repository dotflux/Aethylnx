import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {validate,verifyOtp,verifyInProgress} from "./signup.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/signup", (req, res) => {
  validate(req, res);
});

app.post('/signup/otp',(req,res)=>{
  verifyOtp(req,res);
})

app.post("/verifytk", async (req, res) => {
  const token = req.cookies.signupToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const check = await verifyInProgress(decoded.id);
      if (check){
        res.status(200).json({ valid: true, email: check.email });
        return
      }
    } catch (err) {
      res.status(400).json({ valid: false, error: "Invalid Token" });
      return
    }
  }
  res.status(404).json({valid:false,error:"No Token"})
  return
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
