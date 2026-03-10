import React, { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import { assets as frontendAssets } from "../../Frontend/src/assets/assets";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const currency = "Rs.";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");


  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="flex flex-col gap-6 h-full">
                      <div className="flex flex-col gap-3">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
                          Welcome to Admin Portal
                        </h1>
                        <p className="text-gray-600">
                          Use the sidebar to manage products and view customer
                          orders.
                        </p>
                      </div>

                      <div className="w-full h-[70vh] overflow-hidden">
                        <img
                          src={frontendAssets.banner2}
                          alt="Admin portal hero"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  }
                />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Order token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
