/**
 * Filter Component
 *
 * A fixed filter bar component that allows users to:
 * - Select desired years of experience (0–20 range slider)
 * - Choose a company from a list
 * - Select a preferred work type (Remote, Onsite, Hybrid, Full Time)
 *
 * This component is typically used to filter job listings or candidate preferences.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.experience - Current selected experience in years
 * @param {Function} props.setExperience - Function to update the selected experience
 * @param {string} props.workType - Currently selected work type
 * @param {Function} props.setWorkType - Function to update the selected work type
 * @param {string} props.selectedCompany - Currently selected company ID
 * @param {Function} props.setSelectedCompany - Function to update the selected company
 * @param {Array<Object>} props.companies - Array of available company objects to populate the dropdown
 * @returns {JSX.Element} A horizontal filter bar with inputs for experience, company, and work type
 */

import React from 'react';

const Filter = ({
  experience,
  setExperience,
  workType,
  setWorkType,
  selectedCompany,
  setSelectedCompany,
  companies,
}) => {
  return (
    <div className="fixed top-[56px] left-0 right-0 bg-white shadow-sm border-t border-b border-gray-200 z-10">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 px-4 md:px-56 py-3 overflow-x-auto">
        {/* Experience slider */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="experience" className="text-sm whitespace-nowrap">
            Experience: <span className="font-medium">{experience} yrs</span>
          </label>
          <span className="text-sm w-6 text-left">0</span>
          <input
            id="experience"
            type="range"
            min="0"
            max="20"
            step="1"
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
            className="w-full md:w-40 accent-green-700"
          />
          <span className="text-sm w-6 text-right">20</span>
        </div>

        {/* Company selector */}
        <div className="w-full md:w-auto">
          <select
            className="text-sm border border-gray-300 rounded-full px-4 py-1 w-full md:w-auto bg-white focus:outline-none"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Company</option>
            {companies.map((company, index) => (
              <option key={index} value={company._id || company?.company?.id}>
                {company?.name || company?.company?.name || "No company name"}
              </option>
            ))}
          </select>
        </div>

        {/* Work type selector */}
        <div className="w-full md:w-auto"></div>
        <select
          className="text-sm border border-gray-300 rounded-full px-4 py-1 w-full md:w-auto bg-white focus:outline-none"
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
