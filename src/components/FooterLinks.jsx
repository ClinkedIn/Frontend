import React from 'react'

const FooterLinks = () => {
  return (
    <div>            <div className="text-xs text-gray-500 space-y-2 text-center mt-6">
    <div className="flex justify-center flex-wrap gap-x-4">
      <a href="#" className="hover:underline hover:text-blue-600">About</a>
      <a href="#" className="hover:underline hover:text-blue-600">Accessibility</a>
      <a href="#" className="hover:underline hover:text-blue-600">Help Center</a>
    </div>
    <div className="flex justify-center flex-wrap gap-x-4">
      <a href="#" className="hover:underline hover:text-blue-600">Privacy & Terms</a>
      <a href="#" className="hover:underline hover:text-blue-600">Ad Choices</a>
    </div>
    <div className="flex justify-center flex-wrap gap-x-4">
      <a href="#" className="hover:underline hover:text-blue-600">Advertising</a>
      <a href="#" className="hover:underline hover:text-blue-600">Business Services</a>
    </div>
    <div className="flex justify-center flex-wrap gap-x-4">
      <a href="#" className="hover:underline hover:text-blue-600">Get the LinkedIn app</a>
      <a href="#" className="hover:underline hover:text-blue-600">More</a>
    </div>
    <p className="text-gray-600 mt-2">© 2025 LinkedIn Corporation</p>
  </div></div>
  )
}

export default FooterLinks