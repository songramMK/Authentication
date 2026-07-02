import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Otp from './Otp';
const Login = () => {
    const [data, setData] = useState({
      Confirmpassword: "",
      email: "",
      password: "",
    });
    const navigate = useNavigate() ; 
    const handleChange = (e)=>{
        const {name , value} = e.target; 
        console.log('name: ' , name);
        console.log("value", value);
        setData((prev)=>({...prev, [name]: value})) ; 

    }
    const handleSubmit = async(e)=>{
        e.preventDefault() ; 
        console.log(data);
        if (data.Confirmpassword !== data.password) {
          alert("confirm password is not match");
          return;
        }

        try{
            const res = await axios.post(
              `http://localhost:8000/api/auth/signIn`,
              {
                email: data.email,
                password: data.password,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              },
            );
            console.log(res.data); 
            // <Otp email = {data.email} password={data.password}></Otp>
            navigate('/otp' , {
                state : {
                    email :  data.email
                }
            });
            
        }catch(error){
            console.error(error.message);
        }
    }
  return (
    <div className="">
      <div className=" flex flex-col flex-wrap sm:justify-center sm:items-center mt-5">
        <h1 className="text-2xl break-word sm:text-4xl font-bold text-center  font-serif text-wrap">
          Welcome Back
        </h1>
      </div>
      <div className="min-h-screen flex flex-col flex-wrap  justify-center items-center ">
        <form
          className="w-full max-w-md flex flex-col justify-center border-green-300 border-2 rounded-xl  sm:rounded-2xl px-5 sm:px-10 pb-10"
          onSubmit={handleSubmit}
        >
          <br></br>
          <br></br>
        
          <label
            className="font-bold break-word    font-serif mb-3"
            htmlFor="email"
          >
            Email:{" "}
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            required
            onChange={handleChange}
            className="border  border-green-300 rounded outline-green-600  p-2 sm:p-4 "
          />
          <br></br>
          <label
            className="font-bold break-word  font-serif mb-3"
            htmlFor="password"
          >
            password:{" "}
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
            SignIn
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login