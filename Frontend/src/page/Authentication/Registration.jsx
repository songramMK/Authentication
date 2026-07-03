import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const Registration = () => {
  const [valuee, setValue] = useState({
    userName: "",
    email: "",
    password: "",
    Confirmpassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(valuee);
    if (valuee.Confirmpassword !== valuee.password) {
      alert("Confirm password is not match...");
      return;
    }

    console.log(valuee.userName);
    console.log(valuee.email);
    console.log(valuee.password);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/auth/signUp`,
        {
          userName: valuee.userName,
          email: valuee.email,
          password: valuee.password,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <div className="w-full  min-h-screen flex flex-wrap flex-col justify-center items-center mt-10 rounded-2xl">
        <h1 className="text-xl sm:text-3xl mt-10 break-word  font-bold text-center  font-serif">
          Authentication
        </h1>
        <h1 className="text-xs mt-5 text-gray-300 font-bold text-center  font-serif">
          Sign Up To Your Account
        </h1>

        <div className=" w-full  max-w-md  min-h-screen    flex flex-wrap flex-col justify-center items-center ">
          <form
            className="w-full max-w-md flex flex-col  justify-center sm:px-14 "
            onSubmit={handleSubmit}
          >
            <label className="font-bold font-serif " htmlFor="userName">
              UserName:{" "}
            </label>
            <input
              type="text"
              placeholder="Enter Your UserName"
              name="userName"
              onChange={handleChange}
              className="border mt-1 border-green-300 rounded outline-green-600 p-2 "
            />
            <br></br>
            <label className="font-bold  font-serif " htmlFor="email">
              Email:{" "}
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              onChange={handleChange}
              className="border mt-1 border-green-300 rounded outline-green-600 p-2 "
            />
            <br></br>
            <label className="font-bold  font-serif " htmlFor="password">
              password:{" "}
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChange}
              className="border mt-1 border-green-300 rounded outline-green-600 p-2"
            />
            <br></br>
            <label className="font-bold  font-serif " htmlFor="Confirmpassword">
              Confirm password:{" "}
            </label>
            <input
              type="password"
              placeholder="Enter Confirm Password"
              name="Confirmpassword"
              onChange={handleChange}
              className="border mt-1 border-green-300 rounded outline-green-600 p-2 "
            />
            <br></br>

            <button
              className="btn w-full mt-10 rounded-2xl bg-green-400 hover:bg-green-700"
              type="submit"
            >
              SignUp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
