import React, { useState } from "react";
import Button from "../../generalComponets/Button";

export default function UpdateUserNameForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    additionalName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call or other submission logic here
  };

  return (
    <div className="bg-slate-300 p-2 container mx-auto lg:w-1/2 rounded-3xl shadow-2xl ">
      <form onSubmit={handleSubmit}>
        <p className="text-sm text-gray-600 mb-4">
          <span className="text-red-600">*</span> Indicates required
        </p>

        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-1">
            First name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-1">
            Last name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="additionalName" className="block mb-1">
            Additional name
          </label>
          <input
            type="text"
            id="additionalName"
            name="additionalName"
            value={formData.additionalName}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-6 text-right">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
