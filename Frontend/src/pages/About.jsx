import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-3xl text-center pt-8 border-t">
        <Title text1={"About"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente
            quasi quae corrupti maiores voluptatibus, sed corporis harum esse
            nihil aperiam.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
            rerum quos reiciendis eos facere labore harum quod quae cum,
            laboriosam ut consequatur ipsum ea.
          </p>
          <b className="text-gray-800">Our Misssion</b>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae,
            vitae sed. Cumque molestiae itaque ipsa!
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"Why"} text2={"CHOOSE US?"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Quality Assurance</b>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam
            maiores doloribus fugiat sit. Doloremque, tempore.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Customer Service</b>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam
            maiores doloribus fugiat sit. Doloremque, tempore.
          </p>
        </div>

      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
