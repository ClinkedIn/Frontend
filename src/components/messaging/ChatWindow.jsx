import React, { useEffect, useRef, useState, useCallback,useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import MessageInput from '../../components/messaging/MessageInput';
import MessageItem from '../../components/messaging/MessageItem';
import { FaArrowLeft } from "react-icons/fa";
import { FiUserMinus } from "react-icons/fi";
import { db } from '../../../firebase';


const ChatWindow = ({ conversationId,currentUser,otherUser, onBack }) => {
  
  const [messages, setMessages] = useState([]);
  const [conversationData, setConversationData] = useState(null); // Can be null if doc doesn't exist yet
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingMetadata, setLoadingMetadata] = useState(true); // Separate loading for metadata
  const [isBlockedByYou, setIsBlockedByYou] = useState(false);
  const [isBlockedByOther, setIsBlockedByOther] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

 
  const otherUserInfo = otherUser
  const otherUserId = otherUser?.userId || null; // Use userId from otherUser prop
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch Conversation Metadata
  useEffect(() => {
    if (!conversationId || !currentUser?.uid) {
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

        // Update block status
        setIsBlockedByYou(data.blockedBy?.[currentUser.uid] || false);
        setIsBlockedByOther(otherUserId ? (data.blockedBy?.[otherUserId] || false) : false);

        // Update typing status 
        setIsTyping(otherUserId ? (data.typing?.[otherUserId] || false) : false);

        // Mark conversation as read (only if data exists)
        if (data.unreadCounts?.[currentUser.uid] > 0) {
           updateDoc(convDocRef, {
               [`unreadCounts.${currentUser.uid}`]: 0
           }).catch(err => console.error("Error marking conversation as read:", err));
        }
      } else {
        
        console.log("Conversation document not found (might be new):", conversationId);
        setConversationData(null); // Ensure data is null
        // Reset states that depend on data
        setIsBlockedByYou(false);
        setIsBlockedByOther(false);
        setIsTyping(false);
      }
       setLoadingMetadata(false); // Metadata loading finished 
    }, (error) => {
       console.error("Error fetching conversation details:", error);
       setLoadingMetadata(false);
       setConversationData(null); // Clear data on error
    });

    return () => unsubscribeConv();
    
  }, [conversationId, currentUser?.uid, otherUserId]); 


  // Fetch Messages 
  useEffect(() => {
    // Don't fetch messages if conversationId is missing
    if (!conversationId || !currentUser?.uid) {
        setMessages([]);
        setLoadingMessages(false);
        return;
    }
    setLoadingMessages(true);
    const convDocRef = doc(db, 'conversations', conversationId);
    const messagesColRef = collection(convDocRef, 'messages');
    const q = query(messagesColRef, orderBy('timestamp', 'asc'));

    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((messageDoc) => {
        const messageData = { id: messageDoc.id, ...messageDoc.data() };
        msgs.push(messageData);

        // Mark message as read by current user 
        if (messageData.senderId !== currentUser.uid && !messageData.readBy?.includes(currentUser.uid)) {
           const messageDocRef = doc(messagesColRef, messageDoc.id);
           updateDoc(messageDocRef, {
             readBy: arrayUnion(currentUser.uid)
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
  }, [conversationId, currentUser?.uid]);

  // Scroll to bottom
  useEffect(() => {
    const scrollThreshold = 100;
    const container = messagesEndRef.current?.parentNode;
    if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < scrollThreshold;
        if (isNearBottom || loadingMessages || loadingMetadata) { // Scroll if loading anything
            scrollToBottom();
        }
    } else {
         scrollToBottom();
    }
  }, [messages, loadingMessages, loadingMetadata]);

  //Handle Typing Indicator Updates 
  const updateTypingStatus = useCallback(async (typing) => {
    if (!conversationId || !currentUser?.uid) return;
    const convDocRef = doc(db, 'conversations', conversationId);
    try {
        
        await updateDoc(convDocRef, {
            [`typing.${currentUser.uid}`]: typing
        });
        
    } catch (error) {
        
        console.warn("Could not update typing status (doc might not exist yet):", error);
    }
  }, [conversationId, currentUser?.uid]);


  // Block/Unblock User 
  const handleBlockUser = async () => {
    if (!conversationId || !currentUser?.uid || !otherUserId) return;
    const convDocRef = doc(db, 'conversations', conversationId);
    const currentlyBlocked = isBlockedByYou;
    const newBlockStatus = !currentlyBlocked;
    try {
      // This might fail if the document doesn't exist yet. 
      await updateDoc(convDocRef, {
        [`blockedBy.${currentUser.uid}`]: newBlockStatus
      });
      setIsBlockedByYou(newBlockStatus);
    } catch (error) {
       console.error("Error blocking/unblocking user (doc might not exist yet):", error);
       
    }
  };



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
    return null; // No blocks active
  };

// Determine if the chat is brand new (Firestore doc doesn't exist yet)
  const isNewChat = !loadingMetadata && !conversationData;
  
  return (
    <div className="flex-grow flex flex-col h-full bg-white border-l border-gray-200 ">
      {/* Chat Header */}
      <div className="p-3 border-b flex justify-between items-center bg-gray-50 ">
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
             <p className="font-semibold truncate">{otherUserInfo?.fullName || 'Loading...'}</p>
             {isTyping && <p className="text-xs text-blue-600 animate-pulse">Typing...</p>}
             
           </div>
         </div>
         {/* Actions like Block */}
         {!isBlockedByOther && (
            <button
                onClick={handleBlockUser}
                disabled={!conversationData} // Disable block if chat is new/doc missing
                className={`p-2 rounded-full flex-shrink-0 ${isBlockedByYou ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isBlockedByYou ? `Unblock ${otherUserInfo?.fullName || 'user'}` : `Block ${otherUserInfo?.fullName || 'user'}`}
                aria-label={isBlockedByYou ? 'Unblock user' : 'Block user'}
            >
                <FiUserMinus className="h-5 w-5"/>
            </button>
         )}
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-1 bg-gray-100">
        {isNewChat && messages.length === 0 && (
             <div className="text-center text-gray-500 pt-10">
                 Send a message to start the conversation with {otherUserInfo?.fullName || 'this user'}.
            </div>
        )}
        {/* Show prompt if chat exists but has no messages */}
        {!isNewChat && messages.length === 0 && !loadingMessages && (
            <div className="text-center text-gray-500 pt-10">No messages yet.</div>
        )}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUser.uid}
            senderInfo={msg.senderId === otherUserId ? otherUserInfo : null}
            showReadReceipt={msg.readBy?.includes(otherUserId) }
           />
        ))}
         {/* Anchor for scrolling */}
        <div ref={messagesEndRef} style={{ height: '1px' }} /> {/* Ensure anchor has some height */}
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