import React, { useState, useRef, useEffect } from 'react';

const CreatePostModal = ({ isOpen, onClose, onSubmit, authorInfo }) => {
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Focus the textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle media file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles([...mediaFiles, ...files]);
    
    // Create preview URLs for the files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setMediaPreviewUrls([...mediaPreviewUrls, ...newPreviewUrls]);
  };

  // Remove a media file
  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    const newPreviewUrls = [...mediaPreviewUrls];
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setMediaFiles(newFiles);
    setMediaPreviewUrls(newPreviewUrls);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!postText.trim() && mediaFiles.length === 0) return;
    
    onSubmit({
      text: postText,
      media: mediaFiles
    });
    
    // Clean up
    setPostText('');
    mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setMediaFiles([]);
    setMediaPreviewUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create a post</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Author info */}
        <div className="p-4 flex items-center">
          <img 
            src={authorInfo.profileImage} 
            alt={authorInfo.name} 
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{authorInfo.name}</p>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full mt-1 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              <span>Anyone</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Post content */}
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full border-none outline-none resize-none text-lg"
            rows={6}
          />
          
          {/* Media previews */}
          {mediaPreviewUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {mediaPreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img 
                    src={url} 
                    alt={`Upload ${index + 1}`} 
                    className="w-full h-40 object-cover rounded"
                  />
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Add hashtag button */}
        <div className="px-4 mb-3">
          <button className="text-[#0a66c2] font-semibold text-sm rounded-full px-3 py-1 hover:bg-[rgba(10,102,194,0.1)]">
            Add hashtag
          </button>
        </div>
        
        {/* Media options */}
        <div className="p-4 border-t flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
              multiple
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Add media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button className="p-2 rounded-full hover:bg-gray-100" title="Celebrate an occasion">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </button>
            
            <button className="p-2 rounded-full hover:bg-gray-100" title="Add a document">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!postText.trim() && mediaFiles.length === 0}
            className={`text-white font-semibold px-4 py-1.5 rounded-full ${
              postText.trim() || mediaFiles.length > 0 
                ? 'bg-[#0a66c2] hover:bg-[#084482]' 
                : 'bg-[#0a66c2]/50 cursor-not-allowed'
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;