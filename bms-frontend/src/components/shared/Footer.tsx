import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import mainLogo from "../../assets/main-icon.png";

const Footer = () => {
  return (
    <footer className="bg-[#2b2b2b] text-gray-400 text-sm">
      <div className="border-t border-gray-600 w-full" />
      <div className="flex flex-col items-center py-6">
        {/* Logo */}
        <img src={mainLogo} alt="BookMyScreen Logo" className="w-28 mb-4" />

        {/* Social Icons */}
        <div className="flex space-x-4 mb-4">
          <FaFacebookF className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer" />
          <FaTwitter className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer" />
          <FaInstagram className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer" />
          <FaYoutube className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer" />
          <FaPinterestP className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer" />
          <FaLinkedinIn className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white cursor-pointer" />
        </div>
        {/* Copyright */}
        <p className="text-center text-xs ps-4 max-w-full">
          Copyright {new Date().getFullYear()} &copy; BookMyScreen Pvt Ltd. All
          Rights Reserved.
          <br />
        </p>
        <small>
          The content and images used on this site are copyright protected and
          copyrights vests with the respective owners. The usage of the content
          and images on this website is intended to promote the works and no
          endorsement of the artist shall be implied.
        </small>
      </div>
      {/* </div> */}
    </footer>
  );
};

export default Footer;
