import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/UpperNavBar';
import { FiEdit2 } from "react-icons/fi";
import { BsTypeBold, BsTypeItalic, BsListUl, BsListOl, BsInfoCircleFill } from "react-icons/bs";
  /**
     * Debounce utility function to limit the rate at which a function is invoked.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The delay (in ms) before calling the function.
     * @returns {Function} - The debounced function.
     */
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

/**
 * JobDescriptionPage component handles the creation and editing of a job description.
 * It supports functionality such as formatting text, selecting companies, and navigating between pages.
 * 
 * @component
 * @example
 * return (
 *   <JobDescriptionPage />
 * );
 */
export default function JobDescriptionPage() {
    const location = useLocation()
    const navigate = useNavigate();

    // Inside the component
    const textareaRef = useRef(null);

 
    /**
     * Applies the specified formatting to the selected text in the job description textarea.
     * @param {string} formatType - The type of formatting ('bold', 'italic', 'unordered', 'ordered').
     */
    const applyFormatting = (formatType) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = jobDescription.slice(start, end);

        let formattedText = '';
        switch (formatType) {
            case 'bold':
                formattedText = `**${selectedText || 'bold text'}**`;
                break;
            case 'italic':
                formattedText = `_${selectedText || 'italic text'}_`;
                break;
            case 'unordered':
                formattedText = selectedText
                    ? selectedText.split('\n').map(line => `• ${line}`).join('\n')
                    : '• List item';
                break;
            case 'ordered':
                formattedText = selectedText
                    ? selectedText.split('\n').map((line, idx) => `${idx + 1}. ${line}`).join('\n')
                    : '1. List item';
                break;
            default:
                break;
        }

        const updatedText = jobDescription.slice(0, start) + formattedText + jobDescription.slice(end);
        setJobDescription(updatedText);

        // Re-focus and set cursor after inserted text
        setTimeout(() => {
            textarea.focus();
            const cursorPos = start + formattedText.length;
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);
    };

    const {
        UpdateJobData, // Data passed from ManageJob
        initialNewJobData, // Data passed from HirePage
    } = location.state || {};

    const initialData = UpdateJobData || initialNewJobData || {};
    console.log("pageState", initialData.pageState);

    // Extract individual pieces of data from the determined initialData
    const initialJobTitle = initialData.jobTitle || (initialData.job?.title) || (initialData.job.job.title)||'Job Title';
    const initialCompany = initialData.company || initialData?.company?.company|| { id: null, name: 'Default Company', address: 'Default Address', logo: '' };
    const initialCompanyName = initialCompany.name || initialCompany?.company?.name|| 'Default Company'; 
    const initialJobType = initialData.jobType || (initialData.job?.jobType) || (initialData?.job?.job?.jobType)||"Full Time";
    const initialJobSite = initialData.jobSite || (initialData.job?.workplaceType) ||(initialData.job.job.workplaceType)|| "Remote";
    const initialJobLocation = initialData.location || (initialData.job?.jobLocation)||(initialData.job?.job?.jobLocation) || '';
    const initialJobDescription = initialData.description || (initialData.job?.description)||(initialData.job?.job?.description) || `The ideal candidate will be responsible for developing high-quality applications. They will also be responsible for designing and implementing testable and scalable code.

Responsibilities
• Develop quality software and web applications
• Analyze and maintain existing software applications
• Design highly scalable, testable code
• Discover and fix programming bugs

Qualifications
• Bachelor’s degree or equivalent experience in Computer Science or related field
• Development experience with programming languages
• SQL database or relational database skills`;
    const allCompanies = initialData.allCompanies || [];
    const user = initialData.user;
    const pageState = initialData.pageState; 
    console.log("pageState in desc after setting", pageState);
    let jobId = null;
    if(initialData.job){
        jobId = initialData.job._id; 
    }

    // Initialize states using the extracted initial data
    const [isEditing, setIsEditing] = useState(false);
    const [currentJobTitle, setCurrentJobTitle] = useState(initialJobTitle);
    const [selectedCompany, setSelectedCompany] = useState(initialCompany);
    const [editCompanyInput, setEditCompanyInput] = useState(initialCompanyName); 

    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
    const [currentJobType, setCurrentJobType] = useState(initialJobType);
    const [currentJobSite, setCurrentJobSite] = useState(initialJobSite);
    const [currentJobLocation, setCurrentJobLocation] = useState(initialJobLocation);
    const [jobDescription, setJobDescription] = useState(initialJobDescription);


    const companySuggestionsRef = useRef(null);

   
    /**
     * Effect hook that handles clicks outside the company suggestions list to close it.
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (companySuggestionsRef.current && !companySuggestionsRef.current.contains(e.target)) {
                setShowCompanySuggestions(false);
            }
        };
        // Add the event listener only when suggestions are visible
        if (showCompanySuggestions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showCompanySuggestions]); // Dependency on showCompanySuggestions

     /**
     * Effect hook to set the editing state based on the page state ('CreateJob' or 'UpdateJob').
     */
     useEffect(() => {
         if (pageState === 'CreateJob') { 
             setIsEditing(false);
         } else if (pageState === 'UpdateJob') { 
           
             setIsEditing(true);
         } else {
             setIsEditing(false);
         }
     }, [pageState]); 

    // Editing Handlers
    const handleEditClick = () => {
        setEditCompanyInput(selectedCompany?.name || ''); // Populate company input with current selected company name safely
        setIsEditing(true);
        setShowCompanySuggestions(false); // Hide suggestions when entering edit mode
    };

    const handleCancelClick = () => {
        // Reset states to their initial values based on the extracted initial data
        setCurrentJobTitle(initialJobTitle);
        setSelectedCompany(initialCompany);
        setEditCompanyInput(initialCompanyName); // Safely reset company input
        setCurrentJobType(initialJobType);
        setCurrentJobSite(initialJobSite);
        setCurrentJobLocation(initialJobLocation);
        setJobDescription(initialJobDescription);
        setIsEditing(false);
        setShowCompanySuggestions(false);
    };
    /**
     * Filters company suggestions based on user input and debounces the function call.
     * @param {string} value - The input value to filter company names.
     */
    const filterCompanySuggestions = debounce((value) => {
        if (!value || !Array.isArray(allCompanies)) {
            setCompanySuggestions([]);
            setShowCompanySuggestions(false);
            return;
        }
        const filtered = allCompanies.filter(comp => comp.company.name?.toLowerCase().includes(value.toLowerCase()));
        setCompanySuggestions(filtered);
        setShowCompanySuggestions(filtered.length > 0);
    }, 300);

    /**
     * Handles changes in the company input field and updates suggestions.
     * @param {Object} e - The change event object.
     */
    const handleCompanyInputChange = (e) => {
        const value = e.target.value;
        setEditCompanyInput(value);
        // When input changes, clear the selected company until a suggestion is chosen
        setSelectedCompany({ id: null, name: value, address: '', logo: '' });
        filterCompanySuggestions(value);
    };
    /**
     * Handles a click on a company suggestion and selects it.
     * @param {Object} company - The selected company object.
     */
    const handleCompanySuggestionClick = (company) => {
        setSelectedCompany(company||company.company); 
        setEditCompanyInput(company.name || company.company.name); 
        if (!currentJobLocation || currentJobLocation === (initialCompany?.address || '')) { 
             setCurrentJobLocation(company.address || '');
        }
        setCompanySuggestions([]);
        setShowCompanySuggestions(false);
    };

    // Navigation
    const handleGoBack = () => navigate(-1);

    const handleContinue = () => {
        
        if (isEditing && !selectedCompany?.id && allCompanies.length > 0) {
             // Check if the typed company name exactly matches one in the list
            const match = (allCompanies.find(c => c.company.name?.toLowerCase() === editCompanyInput.toLowerCase())) || initialCompanyName;

            if (match ) {
                setSelectedCompany(match);
            } else {
                alert('Please select a valid company from suggestions.');
                return;
            }
        }


        const finalData = {
            jobTitle: currentJobTitle,
            company: selectedCompany, 
            jobType: currentJobType,
            jobSite: currentJobSite,
            location: currentJobLocation,
            existingJobData: initialData.job,
            description: jobDescription,
            user: user,
        };
        console.log("finalData page state", pageState);
        navigate('/jobsettings', { state: {finalData, pageState, jobId }});
    };

    // Rendering Sections
    const renderTopSection = () => (
        isEditing ? (
            <div className="space-y-4 border-b pb-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title Input */}
                    <div>
                        <label htmlFor="editJobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
                        <input
                            type="text"
                            id="editJobTitle"
                            value={currentJobTitle}
                            onChange={e => setCurrentJobTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    {/* Company Input with Suggestions */}
                    <div className="relative">
                        <label htmlFor="editCompany" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                            type="text"
                            id="editCompany"
                            value={editCompanyInput}
                            onChange={handleCompanyInputChange}
                            onFocus={() => editCompanyInput && companySuggestions.length > 0 && setShowCompanySuggestions(true)}
                            placeholder="Type to search companies..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            autoComplete="off"
                        />
                        {showCompanySuggestions && (
                            <ul ref={companySuggestionsRef} className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {companySuggestions.map((comp) => (
                                     // Use company id as key if available, fallback to name
                                    <li key={comp.id || comp.name||comp.company.id} onClick={() => handleCompanySuggestionClick(comp)} className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center">
                                        <img src={comp.logo||comp.company.logo || 'https://placehold.co/20x20/EBF4FD/0A66C2?text=L'} alt="" className="w-5 h-5 object-contain rounded-full mr-2" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/20x20/EBF4FD/0A66C2?text=L'; }} />
                                        {comp.name|| comp.company.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Workplace Type */}
                    <div>
                        <label htmlFor="editJobSite" className="block text-sm font-medium text-gray-700 mb-1">Workplace type</label>
                        <select
                            id="editJobSite"
                            value={currentJobSite}
                            onChange={e => setCurrentJobSite(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {["Onsite", "Remote", "Hybrid"].map(option => <option key={option}>{option}</option>)}
                        </select>
                    </div>

                    {/* Job Location */}
                    <div>
                        <label htmlFor="editJobLocation" className="block text-sm font-medium text-gray-700 mb-1">Job location</label>
                        <input
                            type="text"
                            id="editJobLocation"
                            value={currentJobLocation}
                            onChange={e => setCurrentJobLocation(e.target.value)}
                            placeholder="e.g., Cairo, Egypt"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    {/* Job Type */}
                    <div>
                        <label htmlFor="editJobType" className="block text-sm font-medium text-gray-700 mb-1">Job type</label>
                        <select
                            id="editJobType"
                            value={currentJobType}
                            onChange={e => setCurrentJobType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {["Full Time", "Part Time", "Contract", "Temporary", "Internship", "Volunteer"].map(option => <option key={option}>{option}</option>)}
                        </select>
                    </div>
                </div>

                {/* Cancel Button */}
                <div className="flex justify-end">
                    <button onClick={handleCancelClick} type="button" className="py-1 px-3 border border-gray-400 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex justify-between items-start border-b pb-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentJobTitle}</h2>
                    <p className="flex items-center text-sm text-gray-600 mt-2">
                         {/* Display company logo if available */}
                         {selectedCompany?.logo && (
                             <img src={selectedCompany.logo} alt="Company Logo" className="w-10 h-10 object-contain rounded-full mr-2" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/EBF4FD/0A66C2?text=Logo'; }} />
                         )}
                         {/* Display placeholder if no logo */}
                         {!selectedCompany?.logo && (
                             <img src={'blank-profile-picture.png'} alt="Company Logo" className="w-10 h-10 object-contain rounded-full mr-2" />
                         )}
                        <span className="font-medium">{selectedCompany?.name || 'N/A'}</span> {/* Display company name safely */}
                        <span className="mx-1.5">•</span>
                        {currentJobType}
                        <span className="mx-1.5">•</span>
                        {currentJobLocation} ({currentJobSite})
                    </p>
                </div>
                <button onClick={handleEditClick} className="text-gray-500 hover:text-gray-700 p-1 ml-4" aria-label="Edit job details">
                    <FiEdit2 size={20} />
                </button>
            </div>
        )
    );

    const handleDescriptionChange = (e) => {
        setJobDescription(e.target.value);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#f4f2ee] py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-3xl space-y-6">
                    {/* Page Title */}
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Enter your job description</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
                        {renderTopSection()}

                        {/* Job description field */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Job description</h3>
                            <p className="text-sm text-gray-500 mb-4">This will be visible to anyone who views your job post.</p>

                            {/* Toolbar */}
                            <div className="flex items-center space-x-1 border border-gray-300 bg-gray-50 p-2 rounded-t-md">
                                <button
                                    className="p-1.5 rounded hover:bg-gray-200"
                                    aria-label="Bold"
                                    onClick={() => applyFormatting('bold')}
                                >
                                    <BsTypeBold size={18} />
                                </button>
                                <button
                                    className="p-1.5 rounded hover:bg-gray-200"
                                    aria-label="Italic"
                                    onClick={() => applyFormatting('italic')}
                                >
                                    <BsTypeItalic size={18} />
                                </button>
                                <div className="h-5 border-l border-gray-300 mx-1"></div>
                                <button
                                    className="p-1.5 rounded hover:bg-gray-200"
                                    aria-label="Unordered List"
                                    onClick={() => applyFormatting('unordered')}
                                >
                                    <BsListUl size={18} />
                                </button>
                                <button
                                    className="p-1.5 rounded hover:bg-gray-200"
                                    aria-label="Ordered List"
                                    onClick={() => applyFormatting('ordered')}
                                >
                                    <BsListOl size={18} />
                                </button>
                            </div>

                            {/* Info box */}
                            <div className="flex items-center justify-between bg-blue-50 text-blue-800 text-sm p-2.5 rounded-md my-3 border border-blue-200">
                                <div className="flex items-center">
                                    <BsInfoCircleFill className="h-4 w-4 mr-2 text-blue-600" />
                                    We added a template to help you.
                                </div>
                                <button onClick={() => setJobDescription('')} className="text-blue-700 hover:underline font-medium">Clear</button>
                            </div>

                            {/* Textarea */}
                            <textarea
                                id="jobDescription"
                                ref={textareaRef}
                                value={jobDescription}
                                onChange={handleDescriptionChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-72 resize-y"
                                placeholder="Start writing your job description here..."
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-between mt-8">
                                <button onClick={handleGoBack} className="py-2 px-5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition ease-in-out">Back</button>
                                <button onClick={handleContinue} className="py-2 px-6 border border-transparent rounded-full text-sm font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004182] transition ease-in-out">Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
