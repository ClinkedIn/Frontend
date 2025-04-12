import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Filter = () => {
  const [companies, setCompanies] = useState([]);
  const [experience, setExperience] = useState(0);
  const [workType, setWorkType]=useState()
  const [selectedCompany, setSelectedCompany] = useState("");


  
  const fetchCompanies= async () => {
    try {
      const response = await axios.get("http://localhost:3000/companies'");
  
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const handleFilter = async () => {
    
      try {
        const params = new URLSearchParams();
        if (experience) params.append('minExperience',experience);
        if (workType) params.append('q', workType);
        if(selectedCompany) params.append('companyId', selectedCompany)
        
        const response = await axios.get(
          `http://localhost:3000/search/jobs?${params}`, 
        );
        console.log("jobs filter", response.data)
        
      } catch (error) {
        console.error("Search error:", error);
        // Optionally show error to user
      }
    };

  useEffect(() => {
    fetchCompanies
  }, []);
  useEffect(() => {
    handleFilter();
  }, [experience, workType, selectedCompany]); // Add dependencies here
  console.log("companies: ", companies )

  return (
    <div className="fixed top-[56px] left-0 right-0 bg-white shadow-sm border-t border-b border-gray-200">
      <div className="flex items-center gap-3 px-56 py-3 overflow-x-auto">
      <label className="mb-1">
        Experience: <span className="font-medium">{experience} yrs</span>
      </label>
        <span className="w-8 text-left">0</span>
        <input
          id="experience"
          type="range"
          min="0"
          max="20"
          step="1"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-40 accent-green-700"
        />

        <span className="w-8 text-right">20</span>
        <select
          className="text-sm border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Company</option>
          {companies?.map((company, index) => (
            <option key={index} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>

        <select
          className="text-sm border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="">Work Type</option>
          <option value="Remote">Remote</option>
          <option value="Onsite">Onsite</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Full Time">Full Time</option>
        </select>

      </div>
    </div>
  );
};

export default Filter;
