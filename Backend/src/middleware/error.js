class Errorhandler extends Error{
    constructor(message , statusCode){
        super(message) ; 
        this.statusCode = statusCode 
    }
}

const errorMiddleware = async(error , req,res , next)=>{
  error.message = error.message || "INTERNAL SERVER ERROR" ; 
  error.statusCode = error.statusCode || 500 ; 
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue).map((key) => key)} \n
        
        Already Exist :  \n

        ${Object.keys(error.keyValue).map((key) => {
          return (key, error.keyValue[key]);
        })}

        ${Object.entries(error.keyValue).map(([key, value]) => (key, value))}
        
        `;
    error = new Errorhandler(message, 400);
  }

  if (error.name === "JsonWebTokenError") {
    const message = `Json Token Errro ... Please Login Now`;
    error = new Errorhandler(message, 400);
  }
  if (error.name === "TokenExpireError") {
    const message = `Token Expired... Please Login Now`;
    error = new Errorhandler(message, 400);
  }
  if (error.name === "CastError") {
    //lkjsojedahdfouweu9r8u3owf
    //lkjsojedahdfouweu9r8u3owf
    //odkjfosdf9
    const message = `Resource Not Found - ${error.path}`;
    error = new Errorhandler(message, 400) ; 
  }
  /*
{
      name: "ValidatorError",
      message: "Path `userName` is required.",
      kind: "required",
      path: "userName",
      value: undefined
    }

    {
      name: "ValidatorError",
      message: "Path `email` is required.",
      kind: "required",
      path: "email",
      value: undefined
    }
    */
  const errorMessage = error.errors
    ? Object.values(error.errors).map((value)=> value.message)
    : error.message;

  return res
    .status(parseInt(error.statusCode))
    .json({ message: errorMessage, success: false }); 
}

module.exports = {Errorhandler , errorMiddleware } ; 