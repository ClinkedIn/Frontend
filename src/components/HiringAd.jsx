import React from 'react'

const HiringAd = () => {
  return (
    <div className="w-72 shadow-sm rounded-lg border border-gray-300">
    <img
      src="/ads.png"
      alt="Ad Banner"
      className="w-72 rounded-lg cursor-pointer"
      onClick={() => navigate("/ads-page")}
    />
  </div>
  )
}

export default HiringAd