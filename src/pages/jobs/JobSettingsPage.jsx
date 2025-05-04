
import React, { useState } from 'react';
import Header from "../../components/UpperNavBar";
import { FiEdit2 } from "react-icons/fi";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus, FaCheck } from "react-icons/fa";
import { BsInfoCircleFill } from "react-icons/bs"; // Import info icon
import ScreeningQuestionCard from '../../components/jobs/ScreeningQuestionCard';
/**
 * JobSettingsPage component allows users to configure job settings such as screening questions, rejection settings, and applicant management.
 * 
 * @component
 * @example
 * // Example usage of JobSettingsPage
 * <JobSettingsPage />
 */
export default function JobSettingsPage() {
    /**
     * Navigate function from react-router-dom to programmatically navigate to different routes.
     */
const navigate = useNavigate();
    /**
     * Location object from react-router-dom to access state and location data.
     */
const location = useLocation();
    /**
     * Final data passed from previous page via router state.
     * @type {Object}
     */
const finalData = location.state.finalData|| {};
    /**
     * State representing the current page state.
     * @type {Object}
     */
const pageState= location.state.pageState ||"no page state available"
console.log("job settings page state:", pageState); // Debugging line to check page state
    /**
     * Job ID passed via router state.
     * @type {string}
     */
const jobId=location.state.jobId||""

    /**
     * State for tracking email updates in "Manage applicants" settings.
     * @type {string}
     */
const [emailUpdates, setEmailUpdates] = useState(finalData.user?.email);
    /**
     * State for holding job settings data, such as screening questions, rejection settings, and manage applicants settings.
     * @type {Array<Object>}
     */
const [settings, setSettings] = useState([
{
title: "Screening questions",
description: "Have you completed the following level of education: Bachelor's Degree?",
sub: "Ideal answer: Yes",

        editableData: {
            questionText: "Have you completed the following level of education: Bachelor's Degree?", // This appears static in the image
            idealAnswer: "Yes", // This is editable
            isMustHave: true, // Checkbox state
        }
    },
    {
        title: "Rejection settings",
        description: "Enabled",
        sub: "Filter out and send rejections to applicants who don’t provide ideal answers to must-have screening questions.",
        avatar: null,
        editableData: {
            enabled: true,
            message: "Thank you for applying. Unfortunately, you do not meet the required qualifications at this time."
        }
    },
    {
        title: "Manage applicants",
        description: "On LinkedIn",
        sub: `I'll send email updates to ${emailUpdates}`,
        avatar: null, // Keep avatar null if not used for this setting
         editableData: {
            emailUpdates: finalData.user?.email,
        }
    },
]);
    /**
     * State for tracking which setting is being edited.
     * @type {number|null}
     */
const [editingSettingIndex, setEditingSettingIndex] = useState(null); // State to track which setting is being edited
    /**
     * State for showing/hiding the add questions list.
     * @type {boolean}
     */
const [showAddQuestions, setShowAddQuestions] = useState(false); // State for showing/hiding add questions list

    /**
     * State for managing screening questions data.
     * @type {Array<Object>}
     */
const [screeningQuestions, setScreeningQuestions] = useState([
    {
        id: "education", 
        type: "Education",
        data: {
            questionText: "Have you completed the following level of education: Bachelor's Degree?",
            idealAnswer: "Yes",
            isMustHave: true,
        }
    }
]);
    /**
     * Options for the types of screening questions that can be added.
     * @type {Array<Object>}
     */
const questionOptions = [
    { id: "backgroundCheck", label: "Background Check", allowMultiple: false },
    { id: "driversLicense", label: "Driver's License", allowMultiple: false },
    { id: "drugTest", label: "Drug Test", allowMultiple: false },
    { id: "education", label: "Education", allowMultiple: false },
    { id: "expertiseSkill", label: "Expertise with Skill", allowMultiple: true },
    { id: "hybridWork", label: "Hybrid Work", allowMultiple: false },
    { id: "industryExperience", label: "Industry Experience", allowMultiple: true },
    { id: "language", label: "Language", allowMultiple: true },
    { id: "location", label: "Location", allowMultiple: true },
    { id: "onsiteWork", label: "Onsite Work", allowMultiple: false },
    { id: "remoteWork", label: "Remote Work", allowMultiple: false },
    { id: "urgentHiring", label: "Urgent Hiring Need", allowMultiple: false },
    { id: "visaStatus", label: "Visa Status", allowMultiple: false },
    { id: "workAuthorization", label: "Work Authorization", allowMultiple: false },
    { id: "workExperience", label: "Work Experience", allowMultiple: true },
    { id: "customQuestion", label: "Custom Question", allowMultiple: true },
];
    /**
     * Navigates back to the previous page.
     */
const handleGoBack = () => navigate(-1);
    /**
     * Handles navigating to the review page with job settings data.
     */
const handleContinue = () => {
    const rejectionSettings = settings.find(s => s.title === "Rejection settings");
console.log("job settings screenig questions:", screeningQuestions); // Debugging line to check screening questions
    console.log("settings page state:", pageState); // Debugging line to check page state
    navigate('/review', {
        state: {
            screeningQuestions,
            rejectionSettings: rejectionSettings ? rejectionSettings.editableData : null,
            finalData, 
            pageState,
            jobId,
            emailUpdates
        },
    });
};
    /**
     * Sets the index of the setting being edited.
     * @param {number} index - Index of the setting to edit.
     */
const handleEditClick = (index) => {
    setEditingSettingIndex(index);
};

    /**
     * Cancels the editing of screening questions and resets state.
     */
// Handlers specific to Screening Questions Edit
const handleCancelScreeningEdit = () => {
    setEditingSettingIndex(null); 
    setShowAddQuestions(false); 
    
};

    /**
     * Toggles the visibility of the add screening questions list.
     */
const handleAddQuestionClick = () => {
    setShowAddQuestions(!showAddQuestions);
};
    /**
     * Updates the screening question with the given id.
     * @param {string} id - The id of the question to update.
     * @param {Object} newData - The new data for the question.
     */
const updateScreeningQuestion = (id, newData) => {
    setScreeningQuestions(prev =>
        prev.map((q) => (q.id === id ? { ...q, data: newData } : q))
    );
};
    /**
     * Removes the screening question with the specified id.
     * @param {string} id - The id of the question to remove.
     */
const handleRemoveQuestion = (id) => {
    setScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
};

    /**
     * Adds a new screening question based on the selected option.
     * @param {Object} option - The selected question option.
     */
const handleQuestionSelect = (option) => {
    const alreadyAdded = screeningQuestions.find(q => q.id === option.id);

    if (!alreadyAdded || option.allowMultiple) {
        const uniqueId = option.allowMultiple ? `${option.id}-${Date.now()}` : option.id;
        setScreeningQuestions(prev => [
            ...prev,
            { id: uniqueId, type: option.label, data: {} } // Initial empty data for the new question
        ]);
    }
};
    /**
     * Determines if a question option is disabled based on the current questions.
     * @param {Object} option - The question option to check.
     * @returns {boolean} - Whether the option is disabled.
     */

const isQuestionDisabled = (option) => {
    // Check if a question with this original ID (not the unique instance ID) already exists and doesn't allow multiple
    const alreadyAdded = screeningQuestions.find(q => q.id.startsWith(`${option.id}-`) ? false : q.id === option.id); // Adjust check for unique IDs
    return alreadyAdded && !option.allowMultiple;
};

    /**
     * Cancels the editing of the "Manage applicants" settings.
     */
// Handlers specific to Manage Applicants Edit
const handleCancelManageApplicantsEdit = () => {
    setEditingSettingIndex(null); // Exit editing mode
    
};
    /**
     * Updates the email for applicant updates in the "Manage applicants" settings.
     * @param {Event} e - The change event of the email input.
     */
const handleEmailUpdatesChange = (e) => {
    const newSettings = [...settings];
    const manageSetting = newSettings.find(s => s.title === "Manage applicants");
    if (manageSetting && manageSetting.editableData) {
        manageSetting.editableData.emailUpdates = e.target.value;
        setSettings(newSettings);
        setEmailUpdates(e.target.value); 
    }
};

    /**
     * Renders the editing view for screening questions.
     * @param {Object} setting - The setting being edited.
     * @returns {JSX.Element} - The JSX for rendering the screening questions edit view.
     */

// Render the editing view for Screening Questions
const renderScreeningQuestionsEdit = (setting) => (
    <div className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Screening questions</h3>
            <button
                onClick={handleCancelScreeningEdit}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
                Cancel
            </button>
        </div>
        <p className="text-sm text-gray-600">
            We recommend adding 3 or more questions. Applicants must answer each question.
        </p>

         {/* Render added questions */}
         {screeningQuestions.map((question) => (
             <div key={question.id} className="mt-4">
                 <ScreeningQuestionCard
                     questionType={question.type}
                     data={question.data}
                     onChange={(newData) => updateScreeningQuestion(question.id, newData)}
                     onRemove={() => handleRemoveQuestion(question.id)} // Use question.id for remove
                 />
             </div>
         ))}

        {/* Add Screening Questions Button and Options */}
        <button
            onClick={handleAddQuestionClick}
            className="flex items-center text-blue-700 hover:underline text-sm font-medium mt-4"
        >
            <span className="text-lg mr-1">{showAddQuestions ? "-" : "+"}</span> Add screening questions
        </button>

        {showAddQuestions && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {questionOptions.map(option => {
                    const disabled = isQuestionDisabled(option);
                    return (
                        <button
                            key={option.id}
                            onClick={() => handleQuestionSelect(option)}
                            disabled={disabled}
                            className={`flex items-center justify-center px-3 py-2 border rounded-full text-sm font-medium transition
                                ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}
                            `}
                        >
                            {disabled ? <FaCheck className="mr-2 text-green-600" /> : <FaPlus className="mr-2" />}
                            {option.label}
                        </button>
                    );
                })}
            </div>
        )}
    </div>
);
    /**
     * Renders the editing view for rejection settings.
     * @param {Object} setting - The rejection setting being edited.
     * @returns {JSX.Element} - The JSX for rendering the rejection settings edit view.
     */
// Render the editing view for Rejection Settings
const renderRejectionSettingsEdit = (setting) => (
    <div className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Rejection settings</h3>
            <button
                onClick={() => setEditingSettingIndex(null)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
                Cancel
            </button>
        </div>

        <div className="flex items-start space-x-2">
            <input
                type="checkbox"
                checked={setting.editableData.enabled}
                onChange={(e) => {
                    const newSettings = [...settings];
                    newSettings[editingSettingIndex].editableData.enabled = e.target.checked;
                    setSettings(newSettings);
                }}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-gray-700 text-sm flex-1">
                Filter out and send rejections to applicants who don’t meet any must-have qualifications.
            </label>
        </div>

        <div className="space-y-1">
            <label className="text-gray-700 text-sm font-medium">Preview*</label>
            <textarea
                value={setting.editableData.message}
                onChange={(e) => {
                    const newSettings = [...settings];
                    newSettings[editingSettingIndex].editableData.message = e.target.value;
                    setSettings(newSettings);
                }}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                maxLength={3000}
            />
            <div className="text-right text-xs text-gray-500">
                {setting.editableData.message.length}/3,000
            </div>
        </div>
    </div>
);


    /**
     * Renders the editing view for manage applicants settings.
     * @param {Object} setting - The manage applicants setting being edited.
     * @returns {JSX.Element} - The JSX for rendering the manage applicants edit view.
     */
 // Render the editing view for Manage Applicants
 const renderManageApplicantsEdit = (setting) => (
    <div className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center"> 
                Manage applicants
                 <BsInfoCircleFill className="ml-2 h-4 w-4 text-gray-400" /> 
            </h3>
            <button
                onClick={handleCancelManageApplicantsEdit}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
                Cancel
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Use grid for layout */}
            {/* Manage applicants dropdown */}
            <div>
                <label htmlFor="manageApplicantsOption" className="block text-sm font-medium text-gray-700 mb-1">Manage applicants</label>
                <p
                    id="manageApplicantsOption"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    On LinkedIn
                    
                </p>
            </div>

            {/* Email for applicant updates input */}
            <div>
                 <label htmlFor="emailUpdates" className="block text-sm font-medium text-gray-700 mb-1">Email for applicant updates<span className="text-red-500">*</span></label>
                 <input
                     type="email"
                     id="emailUpdates"
                     value={setting.editableData.emailUpdates}
                     onChange={handleEmailUpdatesChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                     placeholder="Enter email"
                 />
            </div>
        </div>
    </div>
);

const renderStaticSetting = (setting, index) => (
    <div className="flex justify-between items-start gap-4 border-b border-gray-200 pb-6 last:border-none last:pb-0">
        <div className="min-w-[150px] font-medium text-gray-800">{setting.title}</div>

        <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
                {setting.avatar && (
                    <img src={setting.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                )}
                <p className="text-gray-700">{setting.description}</p>
            </div>
            <p className="text-gray-500 text-sm">{setting.sub}</p>
        </div>

        <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => handleEditClick(index)} // Pass the index to the handler
            aria-label={`Edit ${setting.title}`}
        >
            <FiEdit2 size={18} />
        </button>
    </div>
);

return (
    <>
        <Header />
        <div className="min-h-screen bg-[#f4f2ee] py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-3xl space-y-6">
                {/* Page Title */}
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Confirm your screening questions and job settings
                </h1>

                {/* Job Settings Card */}
                <div className="bg-white rounded-lg shadow p-6 md:p-8 space-y-8">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Job settings</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Your settings control how you screen and collect applicants.
                        </p>
                    </div>

                    {/* Settings List */}
                    <div className="space-y-6">
                        {settings.map((setting, index) => (
                            <div key={index}> 
                                
                                {editingSettingIndex === index && setting.title === "Screening questions" ?
                                    renderScreeningQuestionsEdit(setting)
                                    : editingSettingIndex === index && setting.title === "Rejection settings" ?
                                    renderRejectionSettingsEdit(setting)      
                                    : editingSettingIndex === index && setting.title === "Manage applicants" ?
                                    renderManageApplicantsEdit(setting)
                                    :
                                    renderStaticSetting(setting, index)
                                }
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-6">
                        <button
                            onClick={handleGoBack}
                            className="py-2 px-5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition ease-in-out"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleContinue}
                            className="py-2 px-6 border border-transparent rounded-full text-sm font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004182] transition ease-in-out"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
);

}
