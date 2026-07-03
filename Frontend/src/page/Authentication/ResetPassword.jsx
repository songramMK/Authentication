import axios from 'axios';
import React, { useState } from 'react'
import { Navigate } from 'react-router';

const ResetPassword = () => {
  const [valuee , setValue] = useState({
    newPassword : "" , 
    password : ""
  })
  const HandleSubmit = async(e)=>{
    e.preventDefault() ; 


      try{
            const res = await axios.post(
              `http://localhost:8000/api/auth/signIn`,
              {
                newPassword : valuee.newPassword,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              },
            );
            console.log(res.data);            
            
        }catch(error){
            console.error(error.message);
        }



  }
  const handleChange = (e)=>{
    const {name , value } = e.target ; 
    console.log("name : " , name ) ; 
    console.log("value : " , value) ;


    setValue((prev)=> ({...prev , [name] : value })) ; 
  }
  return (
    <div className="">
      <div className=" flex flex-col flex-wrap sm:justify-center sm:items-center mt-5">
        <h1 className="text-2xl mt-10 break-word sm:text-4xl font-bold text-center  font-serif text-wrap">
            Reset Password
        </h1>
      </div>
      <div className="min-h-screen flex flex-col flex-wrap  justify-center items-center ">
        <form
          className="w-full max-w-md flex flex-col justify-center border-green-300 border-2 rounded-xl  sm:rounded-2xl px-5 sm:px-10 pb-10"
          onSubmit={HandleSubmit}
        >
          <br></br>
          <br></br>

        
        
          <label
            className="font-bold break-word  font-serif mb-3"
            htmlFor="password"
          >
            New Password:{" "}
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
            onChange={handleChange}
            className="border  border-green-300 rounded outline-green-600 p-1 sm:p-4 "
          />
          <br></br>

          <label
            className="font-bold break-word  font-serif mb-3"
            htmlFor="Confirmpassword"
          >
            Confirm password:{" "}
          </label>
          <input
            type="password"
            placeholder="Enter Confirm Password"
            name="Confirmpassword"
            onChange={handleChange}
            className="border  border-green-300 rounded outline-green-600 p-1 sm:p-4 "
          />
          <br></br>

          <button
            className="btn w-full break-word  mt-10 rounded-2xl bg-green-400 hover:bg-green-700"
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword