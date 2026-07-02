const { validationResult } = require("express-validator");
const { Errorhandler } = require("../middleware/error");
const userModel = require("../model/user.model");
const { otpEmailTemplate } = require("../services/email.services");
const OtpGenerate = require("../utils/otpGenerate.utils");
const { verifyHashPasswordGen } = require("../utils/passwordGen.utils");
const { genAccessToken, genRefreshToken, genRefreshTokenCookiePayload, genAccessTokenCookiePayload, verifyAccessToken } = require("../utils/token.utils");
const AssyncHandler = require("../middleware/AssyncHandler");

const SignUp = AssyncHandler(async (req,res,next)=>{
    const ExpressValidationResult = validationResult(req) ; 
    if(!ExpressValidationResult.isEmpty()){
        return res.status(400).json({
            message : ExpressValidationResult.array() , 
            success : false , 
            statusCode : 400
        })
    }

    const { userName  , email , password} = req.body ; 
    if(!userName || !email || !password || userName.trim() == "" || email.trim() == "" || password.trim() == ""){
        return next(Errorhandler("All Fields Required" , 400)) ;
    }
    console.log(userName , email , password) ; 

    const ExistUser = await userModel.findOne({ $or: [{userName : userName} , {email: email} ] }); 
    console.log("ExistUser: ", ExistUser) ;
    if(ExistUser){
        return next(Errorhandler("User Already Exist" , 400)) ; 
    }

    const NewUser = await userModel.create({
        userName, 
        email , 
        password
    }) ; 


    console.log("NEWUSER: ", NewUser) ; 


    const payload = {
        email , 
        id : NewUser._id 
    }; 


    console.log("PAYLOAD: " , payload) ; 
    const AccessToken = genAccessToken(payload) ;
    console.log("AccessToken: ", AccessToken) ;  
    const RefreshToken = genRefreshToken(payload) ; 
    console.log("RefreshToken: ", RefreshToken) ;  
    const RefreshTokenPayload = genRefreshTokenCookiePayload() ; 
    console.log("RefreshTokenPayload: ", RefreshTokenPayload) ;  
    const AccessTokenPayload = genAccessTokenCookiePayload() ; 
    console.log("AccessTokenPayload: ", AccessTokenPayload) ;  

    res.cookie("RefreshToken" , RefreshToken , RefreshTokenPayload) ; 
    res.cookie("AccessToken" , AccessToken , AccessTokenPayload) ; 
    
    await userModel.findByIdAndUpdate(NewUser._id , {
        $push : {
            refreshToken : {
                $each : [
                    {
                        token : RefreshToken , 
                        expireAt : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                    }
                ],
                $slice : -5 
            }
        }
    })

    return res.status(201) .json({
        message : "User Created Successfully" , 
        success : true , 
        statusCode : 201 
    });
})

const SignIn = AssyncHandler( async (req,res,next)=>{
    const ExpressValidationResult = validationResult(req) ; 
    if(!ExpressValidationResult.isEmpty()){
        return res.status(400).json({
            message : ExpressValidationResult.array() , 
            success : false , 
            statusCode : 400
        })
    }
    const {email , password} = req.body ; 
    if( !email || !password ||  email.trim() == "" || password.trim() == ""){
        return next(new Errorhandler("All Fields Required" , 400)) ;
    }

    const UserExist = await userModel.findOne({email}).select("+password") ; 
    if(!UserExist){
        return next(new Errorhandler("User Not Found ... Please Login First..." , 400)) ; 
    }


    const ComparePassword = await verifyHashPasswordGen(password,UserExist.password); 
    console.log("COMPAREPASSWORD: ", ComparePassword) ; 
    if(!ComparePassword){
        return next(new Errorhandler("Password Not Correct" , 401)) ;
    }

    const OtpGenerated = OtpGenerate() ; 
    console.log("OTP: 108", OtpGenerated);

    UserExist.otp = OtpGenerated; 
    UserExist.isOtpVerified = false ; 
    UserExist.otpExpired = Date.now() + 5 * 60 * 1000 ; 

    await UserExist.save() ; 

    console.log("OTP: 116", OtpGenerated);



     const payload = {
        email , 
        id : UserExist._id 
    }; 

        console.log("OTP: 125 ", OtpGenerated);

    const AccessToken = genAccessToken(payload) ; 
    const RefreshToken = genRefreshToken(payload) ; 
    const RefreshTokenPayload = genRefreshTokenCookiePayload() ; 
    const AccessTokenPayload = genAccessTokenCookiePayload() ; 

    res.cookie("RefreshToken" , RefreshToken , RefreshTokenPayload) ; 
    res.cookie("AccessToken" , AccessToken , AccessTokenPayload) ; 
    
    await userModel.findByIdAndUpdate(UserExist._id, {
      $push: {
        refreshToken: {
          $each: [
            {
              token: RefreshToken,
              expiredAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            },
          ],
          $slice: -5,
        },
      },
    });



    otpEmailTemplate(OtpGenerated  , email) ;



    
    return res.status(200).json({message : "OTP SEND YOUR EMAIL..." , statusCode : 200 , success : true }) ; 
})

const ResendOtp = AssyncHandler( async(req,res,next)=>{

    const ExpressValidationResult = validationResult(req) ; 
    if(!ExpressValidationResult.isEmpty()){
        return res.status(400).json({
            message : ExpressValidationResult.array() , 
            success : false , 
            statusCode : 400
        })
    }

    const AccessToken = req.cookies?.AccessToken ; 

    const Decode = verifyAccessToken(AccessToken)  ; 
    if(!Decode){
    return res.status(401).json({
            message : "Authentication ERror" , 
            success : false , 
            statusCode : 401 
        })
    
    }

    const Email = Decode?.email ; 
    console.log("EMAIL", Email) ; 
    if(!Email){
            return res.status(401).json({
                message : "Authentication Error" , 
                success : false , 
                statusCode : 401
            })
    }

    const UserExist = await userModel.findOne({ email: Email }); ; 
    if(!UserExist){
            return res.status(404).json({
                message : "User Not Found" , 
                success : false , 
                statusCode : 404 
            })
    }
    
    const OtpGenerated = OtpGenerate() ; 
    console.log("OTPGENERATED" , OtpGenerated);

    UserExist.otp = OtpGenerated; 
    UserExist.isOtpVerified = false ; 
    UserExist.otpExpired = Date.now() + 5 * 60 * 1000 ; 

    await UserExist.save() ; 

    otpEmailTemplate(OtpGenerated, Email);


    return res.status(200).json({message : "OTP SEND YOUR EMAIL..." , statusCode : 200 , success : true }) ; 



})

const VerifyOtp = AssyncHandler( async(req,res , next)=>{

    const ExpressValidationResult = validationResult(req) ; 
    if(!ExpressValidationResult.isEmpty()){
        return res.status(400).json({
            message : ExpressValidationResult.array() , 
            success : false , 
            statusCode : 400
        })
    }

    const {otp } = req.body ; 
    console.log("OTP : ", otp) ; 
    if(!otp){
        return res.status(400).json({
            message : "OTP REQUIRED" , 
            statusCode : 400 , 
            success : false 
        })
    }
    const AccessToken = req.cookies?.AccessToken ; 

    if(!AccessToken){
        return res.status(401).json({
            message : "Authentication ERror" , 
            success : false , 
            statusCode : 401 
        })
    }

    const Decode = verifyAccessToken(AccessToken)  ; 
    if(!Decode){
  return res.status(401).json({
            message : "Authentication ERror" , 
            success : false , 
            statusCode : 401 
        })
        }

        const Email = Decode.email ; 
        if(!Email){
            return res.status(401).json({
                message : "Authentication Error" , 
                success : false , 
                statusCode : 401
            })
        }

        const UserExist = await userModel.findOne({email: Email}) ; 
        if(!UserExist){
            return res.status(404).json({
                message : "User Not Found" , 
                success : false , 
                statusCode : 404 
            })
        }

    
        if(otp !== UserExist.otp){
            return res.status(401).json({
                message : "OPT NOT MATCHED" , 
                success : false , 
                statusCode : 401 
            })
        }

        if(UserExist.otpExpired < Date.now() ){
            UserExist.isOtpVerified  = false ; 

             return res.status(401).json({
                message : "OPT Time Expired" , 
                success : false , 
                statusCode : 401 
            })        }



            UserExist.isOtpVerified = true ; 
            UserExist.otp = null ; 

            await UserExist.save() ; 


    return res.status(200).json({message : "OTP Validate Successfully" , statusCode : 200 , success : true }) ; 



  
})


const resetPassword = AssyncHandler(async (req, res, next) => {
//   const ExpressValidationResult = validationResult(req);
//   if (!ExpressValidationResult.isEmpty()) {
//     return res.status(400).json({
//       message: ExpressValidationResult.array(),
//       success: false,
//       statusCode: 400,
//     });
//   }
  const { newPassword } = req.body;
  console.log("NEWPASSWORD: " , newPassword) ; 

  if (!newPassword || newPassword.trim() === "") {
    return res
      .status(400)
      .json({ message: "password Rquired", success: false, statusCode: 400 });
  }

  const AccessToken = req.cookies?.AccessToken;

  console.log("AccessToken: ", AccessToken)  ;

  if (!AccessToken) {
    return res.status(401).json({
      message: "Authentication ERror",
      success: false,
      statusCode: 401,
    });
  }

  const Decode = verifyAccessToken(AccessToken);
  console.log("DECODE: " , Decode) ; 
  if (!Decode) {
    return res.status(401).json({
      message: "Authentication ERror",
      success: false,
      statusCode: 401,
    });
  }

  const Email = Decode.email;
  console.log("EMAIL: " , Email);
  if (!Email) {
    return res.status(401).json({
      message: "Authentication Error",
      success: false,
      statusCode: 401,
    });
  }

  const UserExist = await userModel.findOne({ email: Email });
  console.log("USER_EXIST: ", UserExist) ;
  if (!UserExist) {
    return res.status(404).json({
      message: "User Not Found",
      success: false,
      statusCode: 404,
    });
  }

//   await userModel.findByIdAndUpdate(UserExist._id, {
//     password: newPassword,
//   });

const password = newPassword; 
console.log("PASSWORD: ", password) ; 
  UserExist.password = password; 
  await UserExist.save() ; 


  return res.status(200).json({
    message: " Password Reset Successfully ",
    success: true,
    statusCode: 200,
  });
});


module.exports = {SignIn , SignUp , resetPassword , VerifyOtp , ResendOtp } ; 