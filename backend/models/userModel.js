import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const users = mongoose.createConnection(process.env.CONNEC_STR_USR)

users.once('open',() => console.log('MongoDB connected to user model'))
users.on('error',(err) => console.error('MongoDB connection error (User Model):', err));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userId:{type:String,unique:true,required:true},
  displayName: { type: String, default: '' },
  bio: { type: String, default: '' },
  avatarURL: { type: String, default: '' },
  isActive: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastLogin: { type: Date },
}, { timestamps: true });

export const userModel = users.model('usersInfo', userSchema);