import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const dumUsr = mongoose.createConnection(process.env.CONNEC_STR_DUMUSR)

dumUsr.once('open',() => console.log('MongoDB connected to dummy user model'))
dumUsr.on('error',(err) => console.error('MongoDB connection error (DummyUsr):', err));

const dummySchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  userId:{type:String,default:uuidv4,unique:true},
  createdAt:{type:Date,default:Date.now,expires:300}
}, { timestamps: true });

export const dummyUsers = dumUsr.model('dummyUsers', dummySchema);