import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    setToken,
    token,
    setCartItems,
  } = useContext(ShopContext);

  const profileRef = useRef();

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setProfileVisible(false);
  };

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium relative z-50">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logoglam} alt="Logo" className="w-24 h-20" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>Collection</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
        </NavLink>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt="Search"
          className="w-5 cursor-pointer"
        />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <img
            onClick={() => token && setProfileVisible(!profileVisible)}
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile"
          />

          {profileVisible && token && (
            <div className="absolute right-0 mt-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg z-50">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p
                onClick={() => {
                  navigate("/orders");
                  setProfileVisible(false);
                }}
                className="cursor-pointer hover:text-black"
              >
                Orders
              </p>
              <p onClick={logout} className="cursor-pointer hover:text-black">
                Logout
              </p>
            </div>
          )}

          {/* If not logged in, click navigates to login */}
          {!token && (
            <div
              onClick={() => navigate("/login")}
              className="absolute right-0 mt-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg z-50"
            >
              <p className="cursor-pointer hover:text-black">Login</p>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="Cart" className="w-5" />
          <p className="absolute right-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setMenuVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-[70%] bg-white transition-transform duration-300 sm:hidden z-50 ${
          menuVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          <div
            onClick={() => setMenuVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>

          {["/", "/collection", "/about", "/contact"].map((path, index) => {
            const name = path === "/" ? "Home" :
                         path === "/collection" ? "Collection" :
                         path === "/about" ? "About" : "Contact";
            return (
              <NavLink
                key={index}
                to={path}
                onClick={() => setMenuVisible(false)}
                className="py-4 px-6 border-b text-lg"
              >
                {name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;