const mongoose = require('mongoose') ; 
const { hashPasswordGen } = require('../utils/passwordGen.utils');

const userSchem = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName Must Be Required "],
      unique: [true, "UserName Must Be Unique"],
      maxLength: [16, " At Most 16 Character Present"],
      minLength: [3, "AtLeast 3 character Present"],
    },
    email: {
      type: String,
      required: [true, "Email Must Be Required "],
      unique: [true, "Email Must Be Unique"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Provide Valid Email"],
    },
    password: {
      type: String,
      minLength: [6, "At least 6 Character Present"],
      // maxLength: [16, "At Most 16 Character Present"],
      required: true,
      select: false,
    },
    otp: {
      type: String,
      default: null,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpired: {
      type: Date,
      // default: () => Date.now() + 5 * 60 * 1000,
    },
    refreshToken: [
      {
        token: {
          type: String,
          required: true,
        },
        expiredAt: {
          type: Date,
          default: null,
        },
        generated: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true },
); 
userSchem.pre('save' , async function(next){
    try{
        if(!this.isModified('password')){
            return next; 
        }
        this.password = await hashPasswordGen(this.password) ; 
        next; 
    }catch(error){
        next(error); 
    }
}) ; 



const userModel = mongoose.model('users' , userSchem ) ; 
module.exports = userModel; 

