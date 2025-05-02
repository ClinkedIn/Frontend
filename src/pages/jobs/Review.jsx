/**
 * Review component to display job settings, screening questions, rejection settings, and allow users to review and submit job details.
 * 
 * @component
 * @example
 * return (
 *   <Review />
 * )
 */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/UpperNavBar";
import { BsEyeFill } from "react-icons/bs";
import { BiLike, BiDislike } from "react-icons/bi";
import { HiOutlineLightBulb } from "react-icons/hi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from '../../constants';

/**
 * Review function that handles the display and submission of job details, including screening questions and rejection settings.
 * It fetches the necessary data passed from the previous route, renders it, and allows for updates.
 * 
 * @returns {JSX.Element} The rendered component containing job settings, screening questions, and rejection settings.
 */
export default function Review() {
    const location = useLocation();
    const navigate = useNavigate();
    const { finalData, emailUpdates, screeningQuestions, rejectionSettings, pageState, jobId } = location.state || {}; 

    /**
     * Renders the details of each screening question including its ideal answer.
     * 
     * @param {Object} question - The screening question object to render.
     * @returns {JSX.Element} The rendered details of the screening question.
     */
    const renderQuestionDetails = (question) => {
        const details = [];
        if (question.data?.isMustHave) {
            details.push(<span key="mustHave" className="text-green-600 font-semibold mr-3">Must-have</span>);
        }

        let idealAnswerText = "N/A";

        switch (question.type) {
            case "Background Check":
            case "Driver's License":
            case "Drug Test":
            case "Hybrid Work":
            case "Location":
            case "Onsite Work":
            case "Remote Work":
            case "Urgent Hiring Need":
            case "Visa Status":
            case "Work Authorization":
                idealAnswerText = "Yes";
                break;
            case "Education":
                idealAnswerText = question.data?.degree || "Not specified";
                break;
            case "Expertise with Skill":
            case "Industry Experience":
            case "Work Experience":
                idealAnswerText = question.data?.years ? `${question.data.years}` : "Not specified";
                break;
            case "Language":
                idealAnswerText = (question.data?.language || question.data?.proficiency) ? `${question.data.proficiency || 'any level'} in ${question.data.language || 'specified language'}` : "Not specified";
                break;
            case "Custom Question":
                if (question.data?.answerType === 'yesno' || question.data?.answerType === 'number') {
                    idealAnswerText = question.data?.answerValue ?? "Not specified";
                }
                break;
            default:
                idealAnswerText = question.data?.answerValue ?? "Not specified";
                break;
        }

        details.push(<span key="idealAnswer">Ideal Answer: <span className="font-normal">{idealAnswerText}</span></span>);

        return details.length > 0 ? details : <span>No details available.</span>;
    };

    /**
     * Renders the final job data including title, company name, description, location, and job type.
     * 
     * @returns {JSX.Element} The rendered final job data.
     */
    const renderFinalData = () => {
        if (!finalData) return <p className="text-gray-600 text-sm italic">No job data available.</p>;

        return (
            <div className="space-y-2 text-sm text-gray-700">
                {finalData.jobTitle && <p><strong>Title:</strong> {finalData.jobTitle}</p>}
                {finalData.company?.name && <p><strong>Company:</strong> {finalData.company.name}</p>}
                {finalData.description && (
                    <div>
                        <strong>Description:</strong>
                        <p className="whitespace-pre-wrap text-gray-600 mt-1">{finalData.description}</p>
                    </div>
                )}
                {finalData.location && <p><strong>Location:</strong> {finalData.location}</p>}
                {finalData.jobType && <p><strong>Job Type:</strong> {finalData.jobType}</p>}
                {finalData.jobSite && <p><strong>Job Site:</strong> {finalData.jobSite}</p>}
            </div>
        );
    };

    /**
     * Handles the form submission for job details, sending a POST or PUT request to the backend based on the current page state.
     * Displays appropriate success or error messages based on the response.
     * 
     * @async
     * @function
     * @throws {Error} If the request fails, an error message is displayed.
     */
    const handleSubmit = async () => {
        try {
            const payload = {
                companyId: finalData?.company?._id || finalData?.company?.id || finalData?.company?.company?.id || "",
                title: finalData?.jobTitle || "",
                industry: finalData?.company.industry || "Information Technology", 
                workplaceType: finalData?.jobSite || "Remote",
                jobLocation: finalData?.location,
                jobType: finalData?.jobType,
                description: finalData?.description,
                applicationEmail: emailUpdates || "careers@example.com", 
                screeningQuestions: screeningQuestions?.map((q) => ({
                    question: q.type || "Custom Question",
                    idealAnswer: q.data?.years || q.data?.answerValue || q.data?.idealAnswer || "Not specified",
                    mustHave: q.data?.isMustHave || false,
                })) || [],
                autoRejectMustHave: rejectionSettings?.enabled || false,
                rejectPreview: rejectionSettings?.message || "Thank you for your interest, but this position requires experience that matches our needs.",
            };

            let response = null;
            if (pageState === "UpdateJob") {
                response = await axios.put(`${BASE_URL}/jobs/${jobId}`, payload);
                toast.success(response.data.message || "Job posted successfully!");
            } else {
                response = await axios.post(`${BASE_URL}/jobs`, payload);
                toast.success(response.data.message || "Job posted successfully!");
            }

            navigate('/jobdetails', {
                state: { job: response.data, user: finalData.user, company: finalData.company }
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to post the job.");
        }
    };

    return (
        <>
            <Header />
            <Toaster />
            <div className="min-h-screen bg-[#f4f2ee] py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-3xl space-y-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Review your job settings</h1>
                    <div className="bg-white rounded-lg shadow p-6 md:p-8 space-y-8">
                        {/* Final Data Section */}
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Job Information</h2>
                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 mt-4">
                                {renderFinalData()}
                            </div>
                        </div>

                        {/* Screening Questions Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Screening Questions</h3>
                            <p className="text-sm text-gray-600">The questions applicants will be required to answer.</p>
                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 space-y-3">
                                {screeningQuestions?.length > 0 ? (
                                    screeningQuestions.map((q, idx) => (
                                        <div key={q.id || idx} className="pb-3 last:pb-0 border-b last:border-none border-gray-200 text-sm text-gray-700">
                                            <p className="font-medium mb-1">{q.type}</p>
                                            <div className="text-xs text-gray-600 flex flex-wrap gap-x-3">
                                                {renderQuestionDetails(q)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-sm italic">No screening questions added.</p>
                                )}
                            </div>
                        </div>

                        {/* Rejection Settings Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Rejection Settings</h3>
                            <p className="text-sm text-gray-600">Settings for automatically managing rejected applicants.</p>
                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 space-y-3 text-sm text-gray-700">
                                {rejectionSettings ? (
                                    <>
                                        <p><strong>Enabled:</strong> {rejectionSettings.enabled ? "Yes" : "No"}</p>
                                        <div>
                                            <strong>Rejection Message:</strong>
                                            <p className="whitespace-pre-wrap text-gray-600 mt-1">{rejectionSettings.message}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-600 text-sm italic">No rejection settings configured.</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="py-2 px-5 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition ease-in-out"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
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
