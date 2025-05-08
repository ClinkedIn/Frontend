/**
 * Modal component for reporting inappropriate post content.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Function} props.onSubmit - Callback function that handles the report submission
 * 
 * @returns {JSX.Element|null} Rendered modal for reporting posts or null if closed
 * 
 * @example
 * <ReportPostModal
 *   isOpen={isReportModalOpen}
 *   onClose={() => setIsReportModalOpen(false)}
 *   onSubmit={handleReportPost}
 * />
 * 
 * @description
 * This modal component allows users to:
 * - Report posts that violate platform guidelines
 * - Provide a detailed reason for the report
 * - Submit reports to backend moderation services
 * - View submission status and confirmation
 */

import React, { useState } from 'react';

/**
 * Modal component for reporting a post with a custom reason
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when closing the modal
 * @param {function} props.onSubmit - Function to call when submitting the report
 * @returns {JSX.Element|null} The modal component or null if not open
 */
const ReportPostModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      alert('Please provide a reason for your report');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg w-full max-w-md p-5 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Report Post</h2>
        <p className="text-gray-600 mb-4">
          Please explain why you're reporting this post. Your report will be reviewed by our team.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for reporting
            </label>
            <textarea
              id="reason"
              className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
              placeholder="Please describe why you're reporting this post..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPostModal;