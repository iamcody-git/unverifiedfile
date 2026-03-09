import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  const images = [assets.banner2,assets.banner3,assets.bnr]; // your banner images
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 100}%)`,
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="hero"
            className="w-full flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;