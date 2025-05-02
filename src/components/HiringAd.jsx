import React from 'react';
import { useNavigate } from 'react-router-dom';
import adImage from '../assets/ads.png'; // adjust path as needed

const HiringAd = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div className={`w-72 shadow-sm rounded-lg border border-gray-300 ${className}`}>
      <img
        src={adImage}
        alt="Ad Banner"
        className="w-72 rounded-lg cursor-pointer"
        onClick={() => navigate("/ads-page")}
      />
    </div>
  );
};

export default HiringAd;
