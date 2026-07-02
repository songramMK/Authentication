const jwt = require('jsonwebtoken') ; 


const genAccessToken = (payload)=>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
}
const genRefreshToken = (payload)=>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });
}




const verifyAccessToken = (AccessToken) =>{
    return jwt.verify(AccessToken, process.env.ACCESS_TOKEN_SECRET_KEY) ;
}

const verifyRefreshToken = (RefreshToken) =>{
    return jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
}


const genAccessTokenCookiePayload = ()=>{
    const cookie = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE) * 24 * 60 * 60 * 1000,
    };

    return cookie;
}



const genRefreshTokenCookiePayload = ()=>{
    const cookie = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE) * 24 * 60 * 60 * 1000,
    };

    return cookie
}


module.exports = {genAccessToken , genRefreshToken , verifyAccessToken , verifyRefreshToken , genRefreshTokenCookiePayload , genAccessTokenCookiePayload}; 




