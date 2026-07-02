const mongoose = require('mongoose') ; 
const connectedDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URI) ; 
        console.log("Mongodb Connected Successfully");
    }catch(error){
        console.log(error) ; 
        process.exit(1) ; 
    }
}
module.exports = connectedDb; 