import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = ({ setToken }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        backendUrl + "/api/user/admin",
        {
          email,
          password
        }
      );

      if (response.data.success) {

        const token = response.data.token;

        // ✅ Save token
        localStorage.setItem("token", token);

        // ✅ Update state
        setToken(token);

        toast.success("Login successful");

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {

      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">

        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <form onSubmit={onSubmitHandler}>

          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>

            <input
              type="email"
              placeholder="Your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md px-3 py-2 border border-gray-300 outline-none w-full"
            />
          </div>

          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password
            </p>

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md px-3 py-2 border border-gray-300 outline-none w-full"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-2 rounded-md text-white bg-black"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;