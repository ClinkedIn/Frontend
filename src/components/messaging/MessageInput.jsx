import React, { useState, useRef, useCallback } from 'react';
import { db, storage } from '../../../firebase'; 
import { collection, addDoc,getDoc,setDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // For unique file names
import { SlPaperClip } from "react-icons/sl";
import { FaCircleXmark } from "react-icons/fa6";

//  API endpoint URL
//const API_SEND_MESSAGE_URL = '/api/messages/'; 

const MessageInput = ({ currentUser, otherUserId, onTyping }) => {
  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState(null); // { file: File, type: string }
  const [isSending, setIsSending] = useState(false); // Combined sending state
  const [error, setError] = useState(null); // State to hold sending errors
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

   // Debounced typing indicator function
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
    if ((!messageText.trim() && !attachment) || isSending)return; // Don't send empty messages


    setIsSending(true); // Indicate sending process started
    setError(null); // Clear previous errors

    const textToSend = messageText.trim();
    const attachmentToSend = attachment;
    // Use formData to send text and potentially a file
    const formData = new FormData();
    formData.append('recipientId', otherUserId);
    formData.append('text', textToSend);

    if (attachmentToSend) {
      formData.append('file', attachmentToSend.file); 
    }
   
    // Clear input fields immediately for better UX 
    setMessageText('');
    setAttachment(null);
    onTyping(false); // Stop typing indicator on send attempt

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    //let mediaUrl = null;
    //let mediaType = null;
    try {
      //Call Backend API to Send Message (with attachment if present)
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
     const apiConversationId ="12345"

     console.log("API Success, Conversation ID:", apiConversationId);

     // Add Message to Firestore using API's conversationId 
     const messageDataForFirestore = {
       senderId: currentUser.uid,
       text: textToSend,
       mediaUrl: null, 
       mediaType: null, 
       timestamp: serverTimestamp(), // Use Firestore server timestamp for consistency
       readBy: [currentUser.uid], // Sender has implicitly read it

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
             senderId: currentUser.uid,
             timestamp: messageDataForFirestore.timestamp, // Use the same timestamp object
         },
         lastUpdatedAt: messageDataForFirestore.timestamp, // Use the same timestamp object
         participants: [currentUser.uid, otherUserId].sort(),
         typing: { [currentUser.uid]: false, [otherUserId]: false },
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
         [currentUser.uid]: currentUnreadCounts[currentUser.uid] || 0 // Ensure current user count exists
     };



     await setDoc(conversationDocRef, conversationUpdateData, { merge: true });

     console.log("Firestore conversation metadata updated:", apiConversationId);

    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
      // Restore input fields on failure
      setMessageText(textToSend);
      setAttachment(attachmentToSend);
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
    <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
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
      {attachment && !isSending && ( // Hide preview while sending/uploading
        <div className="mb-2 p-2 border rounded bg-white flex justify-between items-center text-sm">
          <span className="truncate">{attachment.file.name}</span>
          <button
            type="button"
            onClick={handleRemoveAttachment}
            className="text-red-500 hover:text-red-700 text-xs ml-2 font-medium"
          >
            Remove
          </button>
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
        />
         {/* Attachment Button */}
         <button
           type="button"
           onClick={() => fileInputRef.current?.click()}
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
          disabled={(!messageText.trim() && !attachment) || isSending}
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