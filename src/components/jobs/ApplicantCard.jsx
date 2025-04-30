import React from "react";
import { formatDistanceToNow } from 'date-fns'; 
const ApplicantCard = ({ applicant, onSelect, isSelected }) => {
    const name = applicant ? `${applicant?.applicant.firstName} ${applicant?.applicant.lastName}` : 'N/A';
    const headline = applicant?.applicant.headline || 'No Headline';
    const profilePicture = applicant?.applicant.profilePicture;
    const appliedTime = applicant?.createdAt
        ? formatDistanceToNow(new Date(applicant.createdAt), { addSuffix: true })
        : 'Unknown time';
    const meetsMustHave = applicant?.screeningAnswers?.some(answer => answer.meetsCriteria === true);
    const mustHaveStatus = meetsMustHave ? '1/1 must-have qualifications' : '0/1 must-have qualifications';

    return (
        
        <div
            className={`flex items-center gap-3 p-3 border-b border-gray-200 last:border-none cursor-pointer hover:bg-gray-100 transition-colors
                       ${isSelected ? 'bg-gray-100' : ''}`}
            onClick={onSelect} 
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {profilePicture ? (
                    <img
                        src={profilePicture}
                        alt={`${name}'s profile`}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/EBF4FD/0A66C2?text=L'; }} // Fallback
                    />
                ) : (
                    // fallback avatar (initials)
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-semibold text-lg">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 overflow-hidden"> 
                
                <div className="flex items-center gap-1">
                    <h2 className="font-semibold text-gray-800 truncate">{name}</h2> 
                   
                </div>

                {/* Title and Location */}
                <div className="text-gray-600 text-sm truncate">{headline}</div>
                
                {/* Application Status */}
                <div className="mt-1 text-xs text-gray-500">
                    Applied {appliedTime} • {mustHaveStatus} 
                    
                </div>
            </div>
        </div>
    );
};

export default ApplicantCard;
