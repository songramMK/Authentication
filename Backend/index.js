const express = require('express') ; 
const dotenv = require('dotenv') ; 
dotenv.config() ; 
const app = express() ; 
const cors = require('cors');
const cookieparser = require('cookie-parser') ; 
const connectedDb = require('./src/config/db');
const port = process.env.PORT

const AuthRouter = require('./src/routes/auth.routes' );
const { errorMiddleware } = require('./src/middleware/error');


app.use(express.json()) ; 
app.use(express.urlencoded({extended : true })) ; 
app.use(cookieparser()) ; 
app.use(cors({
    origin : process.env.FRONTEND_URL , 
    methods : ["POST" , "GET" , "PUT" , "DELETE"] , 
    credentials : true 
}))

connectedDb() ;

app.use('/api/auth',AuthRouter);  
app.use(errorMiddleware); 




app.listen(port , ()=>{
    console.log(`SERVER IS RUNNING AT THE PORT - ${port}`); 
})
