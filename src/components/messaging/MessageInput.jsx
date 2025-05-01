import React, { useState, useRef, useCallback } from 'react';
import { db, storage } from '../../../firebase'; 
import { collection, addDoc,getDoc,setDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // For unique file names
import { SlPaperClip } from "react-icons/sl";
import { FaCircleXmark } from "react-icons/fa6";
import axios from 'axios'; // For API calls
import { BASE_URL } from '../../constants';

//  API endpoint URL
//const API_SEND_MESSAGE_URL = '/api/messages/'; 

const MessageInput = ({ currentUser, otherUserId, onTyping }) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachment] = useState([]); // { file: File, type: string }
  const [isSending, setIsSending] = useState(false); // Combined sending state
  const [error, setError] = useState(null); // State to hold sending errors
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

   // Debounced typing indicator function
      const handleTyping = useCallback(() => {
        onTyping(true); // Indicate start typing
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            onTyping(false); // Indicate stop typing after delay
        }, 1000); 
    }, [onTyping]);

    const handleFileChange = (event) => {
      const selectedFiles = event.target.files;
      if (selectedFiles && selectedFiles.length > 0){
        const newAttachments = Array.from(selectedFiles).map((file) => ({
          id: uuidv4(), // Generate a unique ID for each file
          file,
          type: file.type, // Get the MIME type of the file
        }));
        setAttachment(prevAttachments => [...prevAttachments, ...newAttachments]); // Set the selected files as attachment
        setError(null); // Clear any previous errors
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input value
      }
    };

    const handleRemoveAttachment = (idToRemove) => {
      setAttachment(prevAttachments =>
           prevAttachments.filter(attachment => attachment.id !== idToRemove)
        );
    };
  /**
   * Handles the typing state of the user by notifying when typing starts
   * and stops after a specified delay.
   *
   * @callback handleTyping
   * @returns {void}
   * @description This function triggers the `onTyping` callback with `true` 
   * to indicate that typing has started. It also sets a timeout to call 
   * `onTyping` with `false` after 1 second of inactivity, indicating that 
   * typing has stopped. If the function is called again before the timeout 
   * expires, the previous timeout is cleared and a new one is set.
   *
   * @param {boolean} onTyping - A callback function to notify the typing state.
   */

  /**
   * Sends a message to the backend and updates Firestore with the message and conversation metadata.
   * Handles text messages and optional file attachments.
   *
   * @async
   * @function sendMessage
   * @param {Object} e - The event object from the form submission.
   * @returns {Promise<void>} - Resolves when the message is successfully sent and Firestore is updated.
   *
   * @throws {Error} - Throws an error if the message sending or Firestore update fails.
   *
   * @description
   * This function performs the following steps:
   * 1. Prevents the default form submission behavior.
   * 2. Validates the message input to ensure it is not empty.
   * 3. Sends the message and optional attachment to the backend API.
   * 4. Updates Firestore with the message data and conversation metadata.
   * 5. Handles errors by restoring input fields and setting an error message.
   *
   * @example
   * // Usage example:
   * <form onSubmit={sendMessage}>
   *   <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
   *   <button type="submit">Send</button>
   * </form>
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!messageText.trim() && attachments.length === 0) || isSending)return; // Don't send empty messages


    setIsSending(true); // Indicate sending process started
    setError(null); // Clear previous errors

    const textToSend = messageText.trim();
    const attachmentsToSend = [...attachments]; // Copy attachments to send
    // Use formData to send text and potentially a file
    const formData = new FormData();
    formData.append('receiverId', otherUserId);
    formData.append('messageText', textToSend);
    formData.append('type', "direct");
     if (attachments.length > 0) {
         attachments.forEach(attachment => {
         // Use the same key 'files' for each file. Backend middleware (like Multer)
         // should collect these into an array associated with this key in req.files.
        formData.append('files', attachment.file); // Append file to formData
       });
      }
   
    // Clear input fields immediately for better UX 
    setMessageText('');
    setAttachment([]);
    onTyping(false); // Stop typing indicator on send attempt

    if (typingTimeoutRef.current) 
      clearTimeout(typingTimeoutRef.current);
    //let mediaUrl = null;
    //let mediaType = null;

    try {
      //Call Backend API to Send Message (with attachment if present)
      const response = await axios.post(`${BASE_URL}/messages`, formData,{
          withCredentials:true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
      })
      /*console.log("Sending message via API:", API_SEND_MESSAGE_URL);

      const response = await fetch(API_SEND_MESSAGE_URL, {
        method: 'POST',
        // Headers might include Authorization, but NOT Content-Type for FormData
        // headers: { 'Authorization': `Bearer ${your_auth_token}` },
        body: formData,
      });
      

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Send Message API Error:", response.status, errorData);
        throw new Error(errorData.message || `Send message API failed (status ${response.status})`);
      }

      const result = await response.json();

      // Check for success, conversationId might not be needed here anymore
      // depending on your backend flow and if it handles broadcasting via Firestore
      if (!result.success) {
        console.error("Send Message API Error: Invalid response", result);
        throw new Error(result.message || "Send message API call failed.");
      }

      console.log("Send Message API Success:", result);*/
      // const apiConversationId = result.conversationId;
     /*const apiConversationId ="12345"

     console.log("API Success, Conversation ID:", apiConversationId);

     // Add Message to Firestore using API's conversationId 
     const messageDataForFirestore = {
       senderId: currentUser._id,
       text: textToSend,
       mediaUrl: null, 
       mediaType: null, 
       timestamp: serverTimestamp(), // Use Firestore server timestamp for consistency
       readBy: [currentUser._id], // Sender has implicitly read it

     };
     const conversationDocRef = doc(db, 'conversations', apiConversationId);
     const messagesColRef = collection(conversationDocRef, 'messages');
     await addDoc(messagesColRef, messageDataForFirestore);
     console.log("Message added to Firestore conversation:", apiConversationId);

     // Update Firestore Conversation Metadata 
     // Prepare update data
     const conversationUpdateData = {
         lastMessage: {
             text: textToSend || `Sent a ${mediaType?.split('/')[0] || 'file'}`,
             senderId: currentUser._id,
             timestamp: messageDataForFirestore.timestamp, // Use the same timestamp object
         },
         lastUpdatedAt: messageDataForFirestore.timestamp, // Use the same timestamp object
         participants: [currentUser._id, otherUserId].sort(),
         typing: { [currentUser._id]: false, [otherUserId]: false },
         blockedBy: {},
         unreadCounts: {},
     };

     // Get current unread count and increment safely
     const currentConvSnap = await getDoc(conversationDocRef);
     const currentUnreadCounts = currentConvSnap.data()?.unreadCounts || {};
     const otherUserUnreadCount = (currentUnreadCounts[otherUserId] || 0) + 1;

     // Add the specific unread count update
     conversationUpdateData.unreadCounts = {
         ...currentUnreadCounts, // Keep existing counts
         [otherUserId]: otherUserUnreadCount, // Increment other user's count
         [currentUser._id]: currentUnreadCounts[currentUser._id] || 0 // Ensure current user count exists
     };



     await setDoc(conversationDocRef, conversationUpdateData, { merge: true });

     console.log("Firestore conversation metadata updated:", apiConversationId);*/

    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
      // Restore input fields on failure
      setMessageText(textToSend);
      setAttachment(attachmentsToSend);
    } finally {
      setIsSending(false); // Mark overall sending process as complete
    }

  };

  /**
   * Triggers a click event on the file input element.
   * This allows the user to open the file selection dialog programmatically.
   */
   const triggerFileInput = () => {
     fileInputRef.current?.click();
   };


  return (
    <form onSubmit={sendMessage} className="p-4 border-t border-gray-400 bg-gray-50">
           {/* Display Error Message */}
           {error && (
        <div className="mb-2 p-2 border rounded bg-red-100 text-red-700 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-2">
             <FaCircleXmark className="h-5 w-5 text-red-600" />
          </button>
        </div>
      )}
      {/* Display Attachment Preview */}
      {attachments.length > 0 && !isSending && ( // Hide preview while sending/uploading
        <div className="mb-2 p-2 border rounded bg-white text-sm space-y-1 max-h-24 overflow-y-auto">
      { attachments.map((attachment) => (
        <div key={attachment.id} className="flex justify-between items-center">
          <span className="truncate mr-2">{attachment.file.name}({Math.round(attachment.file.size / 1024)} KB)</span>
          <button
            type="button"
            onClick={()=>{handleRemoveAttachment(attachment.id)}}
            className="text-red-500 hover:text-red-700 text-xs font-medium flex-shrink-0"
            aria-label={`Remove ${attachment.file.name}`}
            >
            Remove
          </button>
          </div>
          ))}
        </div>
      )}
        {/* Sending Indicator */}
        {isSending && (
            <div className="mb-2 text-center text-sm text-gray-600">Sending...</div>
        )}

      {/* Input Row */}
      <div className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" 
          disabled={isSending} // Disable while sending
          name= "files"
          multiple // Allow multiple file selection
        />
         {/* Attachment Button */}
         <button
           type="button"
           onClick={triggerFileInput}
           className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
           title="Attach file"
           disabled={isSending} // Disable while sending
         >
           <SlPaperClip className="h-6 w-6" />
         </button>

        {/* Text Input */}
        <textarea
          value={messageText}
          onChange={(e) => {
             setMessageText(e.target.value);
             handleTyping(); // Trigger typing indicator
          }}
          onBlur={() => {
             onTyping(false); // Stop typing when input loses focus
             if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }}
          rows={1}
          onKeyDown={(e )=> {
            if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new line
              e.preventDefault(); // Prevent default Enter behavior
              sendMessage(e); // Call sendMessage on Enter key press
            }
          }}
          placeholder="Write a message..."
          className="flex-grow resize-none h-24  px-4 py-2 rounded focus:ring-blue-500 bg-[#f4f2ee] overflow-auto-y "
          disabled={isSending} // Disable while sending
          aria-label="Message input"
        />
        {/* Send Button */}
        <button
          type="submit"
          className="py-1 px-3 bg-blue-500 text-white  rounded-full hover:bg-blue-600 disabled:bg-gray-300  disabled:text-gray-400 disabled:cursor-not-allowed"
          // Disable if nothing to send OR if currently sending
          disabled={(!messageText.trim() && attachments.length ===0) || isSending}
          title="Send message"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;