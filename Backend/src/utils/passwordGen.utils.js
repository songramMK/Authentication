require('dotenv').config();
const bcrypt = require('bcrypt') ; 
const hashPasswordGen = async(password)=>{
    return bcrypt.hash(password, Number(process.env.SALT)); 
}



const verifyHashPasswordGen = async(password , hashPassword )=>{
    return bcrypt.compare(password, hashPassword) ; 
}

module.exports = {hashPasswordGen , verifyHashPasswordGen} ;  