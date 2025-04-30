import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/UpperNavBar';
import { PiStarFourFill } from 'react-icons/pi';

// Debounce utility
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const HirePage = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;

  const suggestionsRef = useRef(null);

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('http://localhost:3000/companies');
        setAllCompanies(data || []);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load company suggestions.');
        setAllCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced suggestion filtering
  const filterSuggestions = useCallback(
    debounce((input) => {
      if (!input || !Array.isArray(allCompanies)) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const filtered = allCompanies.filter(
        (comp) => comp.name?.toLowerCase().includes(input.toLowerCase())
      );

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }, 300),
    [allCompanies]
  );

  // Input Handlers
  const handleJobTitleChange = (e) => setJobTitle(e.target.value);

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setCompanyInput(value);
    setSelectedCompany(null);
    filterSuggestions(value);
  };

  const handleSuggestionClick = (company) => {
    setCompanyInput(company.name);
    setSelectedCompany(company);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (!jobTitle) {
      alert('Please fill in the Job Title field!');
      return;
    }
    if (!selectedCompany) {
      alert('Please select a company from the suggestions list!');
      return;
    }
    const initialNewJobData = {
      jobTitle,
      company: selectedCompany,
      user,
      allCompanies,
      pageState:"CreateJob"
    };

    navigate('/jobdescription', {
      state: {
        initialNewJobData,
      },
    });
  };


  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-lg p-8 space-y-6">
          <div className="flex justify-center">
            <PiStarFourFill size={34} color="#0b6abd" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            <span className="bg-gradient-to-r from-[#0b6abd] via-[#0f9f70] to-[#7351c0] bg-clip-text text-transparent">
              Hi {user?.user?.firstName || 'there'},
            </span>{' '}
            find your next great hire
          </h1>

          {/* Job Title */}
          <div className="mt-4">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Job title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={handleJobTitleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add the title you are hiring for"
              required
            />
          </div>

          {/* Company Input */}
          <div className="mt-4 relative">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={companyInput}
              onChange={handleCompanyChange}
              onFocus={() => companyInput && suggestions.length > 0 && setShowSuggestions(true)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type and select your company name"
              autoComplete="off"
              required
            />
            {isLoading && <div className="absolute right-3 top-10 text-xs text-gray-500">Loading...</div>}
            {error && <div className="absolute right-3 top-10 text-xs text-red-500">{error}</div>}

            {showSuggestions && suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((comp) => (
                  <li
                    key={comp.id || comp.name}
                    onClick={() => handleSuggestionClick(comp)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                  >
                    {comp.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full bg-transparent hover:border-[#004182] hover:border-2 hover:bg-[#ebf4fd] focus:ring-2 focus:ring-offset-2 focus:ring-[#004182] transition ease-in-out duration-150"
            >
              Continue on my own
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HirePage;
