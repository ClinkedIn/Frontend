import React from 'react';
import { format } from 'date-fns'; 

const MessageItem = ({ message, isOwnMessage, senderInfo, showReadReceipt }) => {
  const defaultAvatar = '/Images/user.svg';

  /**
   * Renders media content based on the type of media provided in the `message` object.
   * 
   * @returns {JSX.Element|null} A JSX element representing the media content or a link to the media,
   *                             or null if no media URL is provided.
   * 
   * The function handles the following media types:
   * - Images: Renders an <img> element for media types starting with "image/".
   * - Videos: Renders a <video> element for media types starting with "video/".
   * - Other files: Renders an <a> element linking to the media file.
   * 
   * The rendered elements include appropriate styling and accessibility attributes.
   */
  const renderMedia = () => {
    if (!message.mediaUrl ) return null;

    if (message.mediaUrl?.includes('image/')) {
      return <img src={message.mediaUrl} alt="Uploaded content" className="max-w-xs max-h-64 rounded mt-1" />;
    } else if (message.mediaUrl?.includes('video/')) {
      return <video src={message.mediaUrl} controls className="max-w-xs max-h-64 rounded mt-1" />;
    } else {
      return (
        <a
          href={message.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mt-1 block"
        >
          View Document ({'file'})
        </a>
      );
    }
  };

  return (
    <div className={`flex gap-2 my-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <img
          src={senderInfo?.profilePicture || defaultAvatar}
          alt={senderInfo?.fullName || 'Sender'}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div
          className={`max-w-md lg:max-w-lg px-3 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {!isOwnMessage && senderInfo && (
             <p className="text-xs font-semibold mb-1">{senderInfo.fullName}</p>
           )}
          {message.text && <p>{message.text}</p>}
          {renderMedia()}
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp ? format(message.timestamp.toDate(), 'p') : 'Sending...'}
          </p>
        </div>
         {isOwnMessage && showReadReceipt && (
           <p className="text-xs text-gray-500 mt-1">Seen</p>
         )}
          {isOwnMessage && !showReadReceipt && (
           <p className="text-xs text-gray-500 mt-1">Sent</p>
         )}
      </div>
      
       {isOwnMessage && <div className="w-8 flex-shrink-0"></div>}
    </div>
  );
};

export default MessageItem;