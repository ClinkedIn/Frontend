import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/UpperNavBar'; // Assuming you have a Header component
import { PiStarFourFill } from 'react-icons/pi'; // Assuming this icon is used
import { BsInfoCircleFill } from "react-icons/bs"; // Import info icon
import { BASE_URL } from '../../constants'; // Assuming BASE_URL is defined here

// Debounce utility
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

const HirePage = () => {
 

    const location = useLocation(); // Get location object
    const navigate = useNavigate();
    const user = location.state; // Assuming user data is passed in location state
    const preselectedCompany = location.state?.selectedCompany || null;

    const suggestionsRef = useRef(null); // Ref for the suggestions dropdown

    const [jobTitle, setJobTitle] = useState('');
    const [companyInput, setCompanyInput] = useState(preselectedCompany?.name || '');
    const [selectedCompany, setSelectedCompany] = useState(preselectedCompany); // Stores the selected company object (the nested 'company' object)
    const [allCompanies, setAllCompanies] = useState([]); // Stores the list of objects with nested 'company'
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Fetch companies on mount
    useEffect(() => {
        console.log('Fetching companies...');
        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                // Use BASE_URL from constants
                // Assuming the API returns an array of objects, where each object has a 'company' property
                const { data } = await axios.get(`${BASE_URL}/api/companies`);
                setAllCompanies(data || []); // Set fetched companies to allCompanies state
                console.log('Companies fetched:', data);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load company suggestions.');
                setAllCompanies([]); // Clear companies on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount

    // Close suggestions dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Check if the click is outside the suggestions dropdown and the input field
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && e.target.id !== 'company') {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); // Empty dependency array means this runs once on mount

    // Debounced function to filter company suggestions
    const filterSuggestions = React.useCallback(
        debounce((input) => {
            if (!input || !Array.isArray(allCompanies)) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            // Filter based on the nested company name
            const filtered = allCompanies.filter((item) =>
                item.company?.name?.toLowerCase().includes(input.toLowerCase()) // Access nested name
            );

            setSuggestions(filtered);
            // Only show suggestions if there are results
            setShowSuggestions(filtered.length > 0);
        }, 300), // 300ms delay for debounce
        [allCompanies] // Dependency on allCompanies to ensure filter uses the latest data
    );


    useEffect(() => {
        if (companyInput && !preselectedCompany) {
            filterSuggestions(companyInput);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [companyInput, filterSuggestions, preselectedCompany]);

    const handleJobTitleChange = (e) => setJobTitle(e.target.value);

    const handleCompanyChange = (e) => {
        const value = e.target.value;
        setCompanyInput(value);
        setSelectedCompany(null); // Clear selected company when input changes
        // The useEffect on companyInput will handle showing suggestions
    };

    // Handle clicking on a company suggestion
    const handleSuggestionClick = (item) => { // item is the object with the nested 'company'
        setCompanyInput(item.company?.name || ''); // Set input value to selected company name
        setSelectedCompany(item.company || null); // Set the selected company object (the nested one)
        setSuggestions([]); // Clear suggestions
        setShowSuggestions(false); // Hide suggestions
    };

    // Handle focus on the company input field
    const handleCompanyFocus = () => {
        // If there is already input, show suggestions (if any were filtered previously)
        if (companyInput && suggestions.length > 0) {
            setShowSuggestions(true);
        } else if (companyInput && suggestions.length === 0 && allCompanies.length > 0) {
            filterSuggestions(companyInput);
        }
    };


    const handleSubmit = () => {
        // Basic validation: Ensure job title and company are entered/selected
        if (!jobTitle.trim()) {
            alert('Please fill in the Job Title field!');
            return;
        }
        let finalCompany = selectedCompany;

        if (!finalCompany) {
            // If no company is selected from suggestions, check if the typed input matches an existing company name
            const matchedItem = allCompanies.find(item => item.company?.name?.toLowerCase() === companyInput.trim().toLowerCase());
            if (matchedItem) {
                finalCompany = matchedItem.company;
                setSelectedCompany(finalCompany); // Select the nested company object
            } else {
                alert('Please select a valid company from the suggestions list!');
                return; // Prevent navigation if no valid company is selected
            }
        }

        // Gather the initial data for the new job
        const initialNewJobData = {
            jobTitle: jobTitle,
            company: finalCompany, // Pass the selected company object (the nested one)
            user: user,
            allCompanies: allCompanies, // Pass the list of all companies (with nested structure)
            pageState: "CreateJob", // Indicate that this is a new job creation flow
            description: '',
            jobType: 'Full Time', // Example default
            jobSite: 'Onsite', // Example default
            location: finalCompany?.address || '', // Use selected company address as default location if available
        };

        console.log('Navigating to /jobdescription with data:', initialNewJobData);

        // Navigate to the JobDescriptionPage, nesting the data under initialNewJobData
        navigate('/jobdescription', {
            state: {
                initialNewJobData: initialNewJobData, // Pass the data object under the key initialNewJobData
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
                            Hi {user?.user?.firstName || 'there'}, {/* Access user firstName safely */}
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
                            onFocus={handleCompanyFocus} 
                            disabled={!!preselectedCompany}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Type and select your company name"
                            autoComplete="off"
                            required
                        />
                        {/* Loading and Error indicators */}
                        {isLoading && <div className="absolute right-3 top-10 text-xs text-gray-500">Loading...</div>}
                        {error && <div className="absolute right-3 top-10 text-xs text-red-500">{error}</div>}

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <ul
                                ref={suggestionsRef}
                                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                            >
                                {/* Map over the suggestions and access the nested company name */}
                                {suggestions.map((item) => (
                                    <li
                                        key={item.company?.id || item.company?.name} // Use nested id or name as key
                                        onClick={() => handleSuggestionClick(item)} // Pass the full item object
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {item.company?.name} {/* Display nested company name */}
                                    </li>
                                ))}
                            </ul>
                        )}
                         {/* Display selected company name below the input */}
                         {selectedCompany && (
                             <p className="mt-2 text-sm text-gray-600 flex items-center">
                                 Selected:
                                 {/* You might want to display the nested logo here if available */}
                                 {/* {selectedCompany.logo && <img src={selectedCompany.logo} alt="" className="w-5 h-5 object-contain rounded-full ml-2 mr-1" />} */}
                                 <span className="ml-2">{selectedCompany.name}</span> {/* Display nested company name */}
                             </p>
                         )}
                    </div>

                    {/* Info box */}
                    <div className="flex items-center bg-blue-50 text-blue-800 text-sm p-2.5 rounded-md border border-blue-200">
                        <BsInfoCircleFill className="h-4 w-4 mr-2 text-blue-600" />
                        Your company page helps candidates learn about your organization.
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
