import React, { useEffect, useRef, useState, useCallback,useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion,arrayRemove, getDoc, setDoc,  serverTimestamp} from 'firebase/firestore';
import MessageInput from '../../components/messaging/MessageInput';
import MessageItem from '../../components/messaging/MessageItem';
import { FaArrowLeft } from "react-icons/fa";
import { FiUserMinus } from "react-icons/fi";
import { db } from '../../../firebase';
import { format, isToday, isYesterday } from 'date-fns';
import { BASE_URL } from '../../constants';
import axios from 'axios';


/**
 * ChatWindow component for displaying a chat interface between two users.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.conversationId - The unique identifier for the conversation.
 * @param {Object} props.currentUser - The current user's information.
 * @param {string} props.currentUser.uid - The unique identifier of the current user.
 * @param {Object} props.otherUser - The other user's information.
 * @param {string} props.otherUser.userId - The unique identifier of the other user.
 * @param {Function} props.onBack - Callback function to navigate back to the conversations list.
 *
 * @description
 * This component provides a chat interface for messaging between two users. It includes features such as:
 * - Real-time message fetching and updates.
 * - Typing indicators.
 * - Block/unblock functionality.
 * - Scroll-to-bottom behavior for new messages.
 * - Display of conversation metadata and user information.
 *
 * The component handles both new and existing conversations, including cases where the Firestore document
 * for the conversation does not yet exist.
 *
 * @returns {JSX.Element} The rendered ChatWindow component.
 */
const ChatWindow = ({ conversationId,currentUser,otherUser, onBack }) => {
  
  const [messages, setMessages] = useState([]);
  const [conversationData, setConversationData] = useState(null); // Can be null if doc doesn't exist yet
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingMetadata, setLoadingMetadata] = useState(true); // Separate loading for metadata
  const [isBlockedByYou, setIsBlockedByYou] = useState(false);
  const [isBlockedByOther, setIsBlockedByOther] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

 
  const otherUserInfo = otherUser
  const otherUserId = otherUser?._id || null; // Use userId from otherUser prop

  // Fetch Conversation Metadata
  useEffect(() => {
    if (!conversationId || !currentUser?._id) {
        setLoadingMetadata(false);
        setConversationData(null); // Ensure data is null if no ID
        return;
    };

    setLoadingMetadata(true);
    const convDocRef = doc(db, 'conversations', conversationId);
    const unsubscribeConv = onSnapshot(convDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConversationData(data); // Set data if document exists

        // Update typing status 
        setIsTyping(otherUserId ? (data.typing?.[otherUserId] || false) : false);

        // Mark conversation as read (only if data exists)
        /*if (data.unreadCounts?.[currentUser.uid] > 0) {
           updateDoc(convDocRef, {
               [`unreadCounts.${currentUser.uid}`]: 0
           }).catch(err => console.error("Error marking conversation as read:", err));
        }*/
      } else {
        
        console.log("Conversation document not found (might be new):", conversationId);
        setConversationData(null); // Ensure data is null
        setIsTyping(false);
      }
       setLoadingMetadata(false); // Metadata loading finished 
    }, (error) => {
       console.error("Error fetching conversation details:", error);
       setLoadingMetadata(false);
       setConversationData(null); // Clear data on error
    });

    return () => unsubscribeConv();
    /**
     * Subscribes to real-time updates for a conversation document and updates the component state accordingly.
     * 
     * @constant
     * @function unsubscribeConv
     * @param {Object} convDocRef - A Firestore document reference for the conversation.
     * @param {Function} onSnapshot - A Firestore function that listens for real-time updates to the document.
     * @param {Object} docSnap - A snapshot of the conversation document.
     * 
     * @description
     * This function listens for changes to a conversation document in Firestore. It updates the component's state
     * based on the document's data, including block status, typing status, and unread message counts. If the document
     * does not exist, it resets the relevant states. Errors during the snapshot subscription are logged, and the
     * metadata loading state is updated accordingly.
     * 
     * @callback
     * @param {Object} docSnap - The snapshot of the conversation document.
     * @returns {void}
     * 
     * @error
     * Logs any errors encountered while fetching the conversation details or updating the document.
     */
  }, [conversationId, currentUser?._id, otherUserId]); 

   // --- NEW EFFECT: Mark conversation as read when it is selected/opened ---
   useEffect(() => {
    if (!conversationId || !currentUser?._id) {
        return;
    }

    const convDocRef = doc(db, 'conversations', conversationId);

    // Use getDoc to check current state and mark as read only once on load/selection
    const markAsReadOnLoad = async () => {
         try {
            const docSnap = await getDoc(convDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check if the current user has unread messages
                if (data.unreadCounts?.[currentUser._id] > 0) {
                     console.log(`Marking conversation ${conversationId} as READ on selection.`);
                    await updateDoc(convDocRef, {
                        [`unreadCounts.${currentUser._id}`]: 0,
                        ['forceUnread']: false
                    });
                }
            }
         } catch (error) {
            console.error("Error marking conversation as read on selection:", error);
         }
    };

    // Trigger the mark as read logic when conversationId or currentUser changes
    markAsReadOnLoad();

}, [conversationId, currentUser?._id]); // Dependencies: Run when conversationId or currentUser changes


  useEffect(() => {
    if (!conversationId || !currentUser?._id) {
      setLoadingMetadata(false);
      setConversationData(null); // Ensure data is null if no ID
      return;
  };
  const currentUserDocRef = doc(db, 'user', currentUser._id);
  const otherUserDocRef = doc(db, 'user', otherUserId);
  const unsubscribeCurrentUser = onSnapshot(currentUserDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsBlockedByYou(data.blockedUsers?.includes(otherUserId) || false); // Check if the other user is blocked by current user
    } else {
      console.log("Current user document not found:", currentUser._id);
      setIsBlockedByYou(false); // Reset state if document doesn't exist
    }
  }, (error) => {
    console.error("Error fetching current user details:", error);
    setIsBlockedByYou(false); // Reset state on error
  });
  const unsubscribeOtherUser = onSnapshot(otherUserDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsBlockedByOther(data.blockedUsers?.includes(currentUser._id) || false); // Check if the current user is blocked by other user
    } else {
      console.log("Other user document not found:", otherUserId);
      setIsBlockedByOther(false); // Reset state if document doesn't exist
    }
  }
  , (error) => {
    console.error("Error fetching other user details:", error);
    setIsBlockedByOther(false); // Reset state on error
  });
  // Cleanup listeners on unmount
  return () => {
    unsubscribeCurrentUser();
    unsubscribeOtherUser();
  };

  },[conversationId, currentUser?._id, otherUserId]); // Re-run if conversationId or user changes

  // Fetch Messages 
  useEffect(() => {
    // Don't fetch messages if conversationId is missing
    if (!conversationId || !currentUser?._id) {
        setMessages([]);
        setLoadingMessages(false);
        return;
    }
    setLoadingMessages(true);
    const convDocRef = doc(db, 'conversations', conversationId);
    const messagesColRef = collection(convDocRef, 'messages');
    const q = query(messagesColRef, orderBy('timestamp', 'asc'));

    /**
     * Subscribes to a Firestore query to fetch and listen for real-time updates to messages.
     * Updates the local state with the fetched messages and marks messages as read for the current user.
     *
     * @param {Query} q - The Firestore query object to fetch messages.
     * @param {Function} setMessages - A state setter function to update the list of messages.
     * @param {Function} setLoadingMessages - A state setter function to update the loading state.
     * @param {Object} currentUser - The current user's information.
     * @param {string} currentUser.uid - The unique identifier of the current user.
     * @param {CollectionReference} messagesColRef - The Firestore collection reference for messages.
     *
     * @returns {Function} A function to unsubscribe from the Firestore query listener.
     */
    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((messageDoc) => {
        const messageData = { id: messageDoc.id, ...messageDoc.data() };
        msgs.push(messageData);

        // Mark message as read by current user 
        if (messageData.senderId !== currentUser._id && !messageData.readBy?.includes(currentUser._id)) {
           const messageDocRef = doc(messagesColRef, messageDoc.id);
           updateDoc(messageDocRef, {
             readBy: arrayUnion(currentUser._id)
           }).catch(err => console.error("Error updating read receipt:", err));
        }
      });
      setMessages(msgs);
      setLoadingMessages(false);
    }, (error) => {
       console.error("Error fetching messages:", error);
       setLoadingMessages(false);
    });

    return () => unsubscribeMessages();
  }, [conversationId, currentUser?._id]);

  // Scroll to bottom

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!messagesContainerRef.current || !messagesEndRef.current) return;
    const scrollToBottom = () => {
        requestAnimationFrame(() => {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth' ,
            block: 'end'
          });
        });
  };
    
    const scrollDistanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (scrollDistanceFromBottom > 50) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId); 
    }

    
  }, [messages, loadingMessages, loadingMetadata]);

  //Handle Typing Indicator Updates 
  /**
   * Updates the typing status of the current user in the specified conversation.
   *
   * @function
   * @async
   * @param {boolean} typing - Indicates whether the user is currently typing (true) or not (false).
   * @returns {Promise<void>} Resolves when the typing status is successfully updated, or logs a warning if an error occurs.
   * @throws {Error} Logs a warning if the document does not exist or the update fails.
   * 
   * @example
   * updateTypingStatus(true); // Sets the typing status to true (user is typing).
   * updateTypingStatus(false); // Sets the typing status to false (user stopped typing).
   */
  const updateTypingStatus = useCallback(async (typing) => {
    if (!conversationId || !currentUser?._id) return;
    const convDocRef = doc(db, 'conversations', conversationId);
    try {
        
        await updateDoc(convDocRef, {
            [`typing.${currentUser._id}`]: typing
        });
        
    } catch (error) {
        
        console.warn("Could not update typing status (doc might not exist yet):", error);
    }
  }, [conversationId, currentUser?._id]);


  // Block/Unblock User 
  /**
   * Toggles the block status of the other user in the current conversation.
   * Updates the conversation document in the database to reflect the new block status.
   * 
   * @async
   * @function handleBlockUser
   * @returns {Promise<void>} Resolves when the block status is successfully updated.
   * @throws Will log an error if the document update fails (e.g., if the document does not exist).
   * 
   * @description
   * - If the conversation ID, current user ID, or other user ID is missing, the function exits early.
   * - Retrieves the conversation document reference from the database.
   * - Toggles the block status for the current user in the conversation document.
   * - Updates the local state to reflect the new block status.
   */
  const handleBlockUser = async () => {
    if (!currentUser?._id || !otherUserId) {
        console.error("Cannot block/unblock: Missing user IDs.");
        return;
    }

    // --- Corrected collection name to 'users' ---
    const userDocRef = doc(db, 'user', currentUser._id); // Reference to the CURRENT user's document
    const currentlyBlocked = isBlockedByYou;

    console.log(`Attempting to ${currentlyBlocked ? 'unblock' : 'block'} user: ${otherUserId}`);

    try {
      if (currentlyBlocked) {
        // --- UNBLOCK ---
        // Use updateDoc, assuming doc exists if unblocking
        await updateDoc(userDocRef, {
          blockedUsers: arrayRemove(otherUserId)
        });
        setIsBlockedByYou(false); // Optimistic UI update
        console.log(`User ${otherUserId} unblocked successfully.`);
      } else {
        // --- BLOCK ---
        // Use setDoc with merge: true to create or update
        await setDoc(userDocRef,
          {
            // Data to set/merge: only the blockedUsers field modification
            blockedUsers: arrayUnion(otherUserId)
          },
          { merge: true } // Option to merge data
        );
        setIsBlockedByYou(true); // Optimistic UI update
        console.log(`User ${otherUserId} blocked successfully (doc created if needed).`);
      }
    } catch (error) {
       console.error("Error updating block status on user document:", error);
       // Consider reverting optimistic UI update here if needed
       // setIsBlockedByYou(currentlyBlocked);
    }
  };
      //Memoize messages with date separators 
      const messagesWithDates = useMemo(() => {
        const items = [];
        let lastDate = null;

        const formatDateSeparator = (date) => {
            if (isToday(date)) {
                return 'Today';
            }
            if (isYesterday(date)) {
                return 'Yesterday';
            }
            return format(date, 'MMMM d, yyyy'); 
        };

        messages.forEach((message) => {
          if (!message.timestamp)
            return;
            const messageDate = message.timestamp.toDate(); // Convert Firestore Timestamp to Date
            const messageDateString = format(messageDate, 'yyyy-MM-dd'); // Format for comparison

            if (lastDate === null || messageDateString !== lastDate) {
                // Add date separator
                items.push({
                    type: 'date',
                    date: formatDateSeparator(messageDate),
                    key: `date-${messageDateString}` // Unique key for the date separator
                });
                lastDate = messageDateString;
            }

            // Add the message itself
            items.push({
                type: 'message',
                message: message,
                key: message.id // Use message ID as the key
            });
        });

        return items;
      }, [messages]); // Re-compute whenever the 'messages' state changes

    //Delete Message Handler
    const handleDeleteMessage = useCallback(async (messageId) => {
      if (!conversationId || !messageId) {
          console.error("Cannot delete message: Missing conversation or message ID.");
          return;
      }
     
      //const messageDocRef = doc(db, 'conversations', conversationId, 'messages', messageId);
  
      try {
        console.log(`Attempting to delete message ${messageId} from conversation ${conversationId}`);
        const response = await axios.delete(`${BASE_URL}/api/messages/${messageId}`,{
            withCredentials: true
        });
        console.log("Message deleted successfully:", response.data);

        /*await updateDoc(messageDocRef, {
            text: "This message has been deleted", 
            mediaUrls: [], 
            mediaTypes: [],
            isDeleted: true, 
            editedAt: serverTimestamp() 
        });
        console.log("Message soft-deleted successfully.");*/
    } catch (error) {
        console.error("Error soft-deleting message:", error);
        
    }
    }, [conversationId]); 
  
  
    // Update Message Handler 
    const handleUpdateMessage = useCallback(async (messageId, newText) => {
        if (!conversationId || !messageId || typeof newText !== 'string') {
            console.error("Cannot update message: Missing IDs or invalid text.");
            return;
        }
        console.log(`Attempting to update message ${messageId} in conversation ${conversationId}`);
        //const messageDocRef = doc(db, 'conversations', conversationId, 'messages', messageId);
        
  
        try {
          const response = await axios.patch(`${BASE_URL}/api/messages/${messageId}`,{messageText : newText},{
            withCredentials: true
          });
          console.log("Message updated successfully:", response.data);
          /*await updateDoc(messageDocRef, { text: newText, editedAt: serverTimestamp() });
          console.log("Message updated successfully.");
          // Update lastMessage snippet if this was the last message
          if (messages.length > 0 && messages[messages.length - 1].id === messageId) {
              const convDocRef = doc(db, 'conversations', conversationId);
              await updateDoc(convDocRef, {
                  'lastMessage.text': newText,
                  'lastMessage.timestamp': serverTimestamp(),
                  'lastUpdatedAt': serverTimestamp()
              }).catch(err => console.error("Error updating lastMessage snippet after edit:", err));
          }*/
      } catch (error) {
         console.error("Error updating message:", error);
     }
    }, [conversationId, messages]);


  if (!conversationId) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 text-gray-500 h-full p-4 text-center">
            <button
                onClick={onBack}
                aria-label="Go back to conversations"
                className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-900 md:hidden" // Show only on mobile
            >
               
                <FaArrowLeft className="h-6 w-6" />
            </button>
            Select a conversation to start messaging.
        </div>
    );
  }



  const renderBlockedMessage = () => {
    if (isBlockedByYou) {
        return (
            <div className="p-4 text-center bg-yellow-100 text-yellow-800 text-sm">
                You have blocked {otherUserInfo?.fullName || 'this user'}. You can't send or receive messages.
                <button onClick={handleBlockUser} className="ml-2 font-semibold text-yellow-900 hover:underline">Unblock</button>
            </div>
        );
    }
    if (isBlockedByOther) {
         return (
             <div className="p-4 text-center bg-red-100 text-red-800 text-sm">
                 You can't reply to this conversation. {otherUserInfo?.fullName || 'This user'} has blocked you.
             </div>
         );
    }
    return null; 
  };

// Determine if the chat is brand new (Firestore doc doesn't exist yet)
  const isNewChat = !loadingMetadata && !conversationData;
  
  return (
    <div className="flex-grow flex flex-col h-full bg-white border-l border-gray-400 ">
      {/* Chat Header */}
      <div className="p-3 border-b border-gray-400 flex justify-between items-center bg-gray-50 ">
         <div className="flex items-center gap-3 min-w-0"> 
            <button
                onClick={onBack}
                aria-label="Go back to conversations"
                className="p-1 text-gray-600 hover:text-gray-900 md:hidden" // Show back arrow on mobile/small screens
            >
                
                <FaArrowLeft className="h-6 w-6" />
            </button>
           <img
             src={otherUserInfo?.profilePicture || 'https://via.placeholder.com/40/808080/FFFFFF?text=?'}
             alt={otherUserInfo?.fullName || 'User'}
             className="w-10 h-10 rounded-full flex-shrink-0" 
           />
           <div className="min-w-0">
             <p className="font-semibold truncate">{(otherUserInfo?.firstName +"  "+ otherUserInfo?.lastName )  || 'Loading...'}</p>
             {isTyping && <p className="text-xs text-blue-600 animate-pulse">Typing...</p>}
             
           </div>
         </div>
         {/* Actions like Block */}
         {!isBlockedByOther && (
            <button
                onClick={handleBlockUser}
                className={`p-2 rounded-full flex-shrink-0 ${isBlockedByYou ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isBlockedByYou ? `Unblock ${otherUserInfo?.fullName || 'user'}` : `Block ${otherUserInfo?.fullName || 'user'}`}
                aria-label={isBlockedByYou ? 'Unblock user' : 'Block user'}
            >
                <FiUserMinus className="h-5 w-5"/>
            </button>
         )}
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto  space-y-1  h-[calc(100vh-200px)]" ref={messagesContainerRef} >
        {isNewChat && messages.length === 0 && (
             <div className="text-center text-gray-500 pt-10">
                 Send a message to start the conversation with {otherUserInfo?.fullName || 'this user'}.
            </div>
        )}
        {/* Show prompt if chat exists but has no messages */}
        {!isNewChat && messages.length === 0 && !loadingMessages && !loadingMetadata && (
            <div className="text-center text-gray-500 pt-10">No messages yet.</div>
        )}
        {messagesWithDates.map((item) => {
                    if (item.type === 'date') {
                        
                        return (
                            <div key={item.key} className="text-center text-xs text-gray-500 my-4 select-none sticky top-0 z-10 ">
                                <span className="bg-gray-200 px-3 py-1 rounded-full shadow-sm">
                                   {item.date}
                                </span>
                            </div>
                        );
                    } else {
                        
                        return (
                            <MessageItem
                                key={item.key} 
                                message={item.message}
                                isOwnMessage={item.message.senderId === currentUser._id}
                                senderInfo={item.message.senderId === otherUserId ? otherUserInfo : null}
                                showReadReceipt={item.message.senderId === currentUser?._id && item.message.readBy[otherUserId]}
                                onDeleteMessage={handleDeleteMessage} 
                                onUpdateMessage={handleUpdateMessage}
                            />
                        );
                    }})}
         {/* Anchor for scrolling */}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Blocked Message / Message Input Area */}
      {renderBlockedMessage() || (
           <MessageInput
             currentUser={currentUser}
             otherUserId={otherUserId} 
             onTyping={updateTypingStatus}
             
           />
       )}
    </div>
  );
};

export default ChatWindow;