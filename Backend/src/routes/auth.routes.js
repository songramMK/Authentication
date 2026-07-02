const express = require("express");
const AuthRouter = express.Router();
const { body } = require("express-validator");
const {
  SignIn,
  SignUp,
  otp,
  verifyOtp,
  resetPassword,
  ResendOtp,
  VerifyOtp,
} = require("../controller/Auth.controller");

const LoginMiddleware = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Provide Authentic Email"),
  body("password")
    .isLength({ min: 6 })
    .isLength({ max: 16 })
    .withMessage("Password Must Be Between 6 to 16 Character"),
];
const SignUpMiddleware = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Provide Authentic Email"),
  body("userName")
    .trim()
    .isLength({ min: 3 })
    .isLength({ max: 12 })
    .withMessage("Provide UserName Between 3 to 12 character"),
  body("password")
    .isLength({ min: 6 })
    .isLength({ max: 16 })
    .withMessage("Password Must Be Between 6 to 12 Character"),
];

const OtpMiddleware = [
  body("otp")
    .isLength({ min: 6 })
    .isLength({ max: 6 })
    .withMessage("OTP MUST BE PRESENT 6 character"),
];

const resetPasswordMiddleware = [
  body("newPassword")
    .isLength({ min: 6 })
    .isLength({ max: 16 })
    .withMessage("Password Must Be Between 6 to 12 Character"),
];

AuthRouter.post("/signUp", SignUpMiddleware, SignUp);
AuthRouter.post("/signIn", LoginMiddleware, SignIn);
AuthRouter.get("/resendotp",  ResendOtp);
AuthRouter.post("/verify-otp", OtpMiddleware, VerifyOtp);
AuthRouter.post("/resetpassword", resetPasswordMiddleware,  resetPassword);

module.exports = AuthRouter;
