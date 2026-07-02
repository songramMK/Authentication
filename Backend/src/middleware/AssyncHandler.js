const AssyncHandler = (TheFunction)=> (req, res,next)=>{
    Promise.resolve((TheFunction(req,res,next))).catch(next)
}; 
module.exports = AssyncHandler ; 