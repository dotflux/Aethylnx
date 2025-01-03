import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dumUsr = mongoose.createConnection(process.env.CONNEC_STR_DUMUSR)

dumUsr.once('open',() => console.log('MongoDB connected to dummy user model (reset)'))
dumUsr.on('error',(err) => console.error('MongoDB connection error (DummyUsr):', err));

const resetPassSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  otp: { type: String, required: true },
  userId:{type:String,unique:true,required:true},
  createdAt:{type:Date,default:Date.now,expires:300}
}, { timestamps: true });

export const passReset = dumUsr.model('passreset', resetPassSchema);