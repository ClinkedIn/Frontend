import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../../constants";

/**
 * The Filter component provides an interface for users to filter job search results based on company, 
 * experience, and work type. It fetches company data from an API and allows users to select filters 
 * that are used to query job listings.
 * 
 * @component
 * @example
 * // Usage
 * <Filter />
 */
const Filter = () => {
  const [companies, setCompanies] = useState([]);
  const [experience, setExperience] = useState(0);
  const [workType, setWorkType]=useState()
  const [selectedCompany, setSelectedCompany] = useState("");


  /**
   * Fetches company data from the API and sets the companies state.
   * This function is called on component mount to populate the company selection list.
   * 
   * @async
   * @function fetchCompanies
   * @returns {Promise<void>}
   */
  const fetchCompanies= async () => {
    try {
      const response = await axios.get(`${BASE_URL}/companies`);
  
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  /**
   * Handles the job filter request. It builds a query string based on selected filter values 
   * and fetches filtered job listings from the API.
   * 
   * @async
   * @function handleFilter
   * @returns {Promise<void>}
   */
  const handleFilter = async () => {
    
      try {
        const params = new URLSearchParams();
        if (experience) params.append('minExperience',experience);
        if (workType) params.append('q', workType);
        if(selectedCompany) params.append('companyId', selectedCompany)
        
        const response = await axios.get(
          `${BASE_URL}/search/jobs?${params}`, 
        );
        console.log("jobs filter", response.data)
        
      } catch (error) {
        console.error("Search error:", error);
      }
    };

  useEffect(() => {
    fetchCompanies
  }, []);
  useEffect(() => {
    handleFilter();
  }, [experience, workType, selectedCompany]); 
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
