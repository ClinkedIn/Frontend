import React, { useState, useEffect } from 'react';
import { useParams ,useLocation} from 'react-router-dom';
import { useParams ,useLocation} from 'react-router-dom';
import ConversationList from '../../components/messaging/ConversationList';
import ChatWindow from '../../components/messaging/ChatWindow'; 
import Header from '../../components/UpperNavBar';
import { set } from 'date-fns';
import { db } from '../../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
import { BASE_URL } from '../../constants';

// Function to create the composite conversation ID
const createConversationId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` :  `${uid2}_${uid1}`;
};


const MessagingPage = () => {
    const location = useLocation();
    const  jobApplicant = location.state || {};
    console.log("jobApplicant", jobApplicant); // DEBUG
    const [otherUser, setOtherUser] = useState(jobApplicant);
    const [currentUser, setUser] = useState();
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [showChatOnMobile, setShowChatOnMobile] = useState(!!jobApplicant); // For mobile ui
    const [notifications, setNotifications] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [errorConversations, setErrorConversations] = useState(jobApplicant ? createConversationId(currentUser?._id, jobApplicant._id) : null);
    
   


    
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/user/me`, {
          
              withCredentials:true
            });
        
            setUser(response.data.user);
            console.log("User data:", response.data.user);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
        fetchUser(); 

      }, []);

    useEffect(() => {
       
        if (!currentUser?._id) {
            setLoadingConversations(false);
            setErrorConversations("Loading user data...");
            setConversations([]);
            return;
        };

        setLoadingConversations(true);
        setErrorConversations(null);

        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', currentUser._id),
            orderBy('lastUpdatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const convos = [];
            querySnapshot.forEach((doc) => {
                convos.push({ id: doc.id, ...doc.data() });
            });
            setConversations(convos);
            setLoadingConversations(false);
        }, (error) => {
            console.error("Error fetching conversations: ", error);
            setErrorConversations("Failed to load conversations.");
            setLoadingConversations(false);
            setConversations([]);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();

    }, [currentUser?._id]); // Re-run if user changes

    // Reset selected chat if user logs out/changes
    useEffect(() => {
        if (!currentUser) {
            setSelectedConversationId(null);
            setShowChatOnMobile(false);
        }
    }, [currentUser]);

    useEffect(() => {
      if (jobApplicant && currentUser?._id) {
          const conversationId = createConversationId(currentUser._id, jobApplicant._id);
          setSelectedConversationId(conversationId);
          setOtherUser(jobApplicant);
          setShowChatOnMobile(true);
      }
  }, [currentUser?._id, jobApplicant]);

    const handleSelectConversation = (conversationId,otherUserInfo) => {
        setSelectedConversationId(conversationId);
        setOtherUser(otherUserInfo); 
        setShowChatOnMobile(true); // Show chat window on mobile when a conversation is selected
    };

    const handleBackToList = () => {
        setSelectedConversationId(null); 
        setShowChatOnMobile(false);
    };

    // Function to handle selecting a user from search results
    const handleSelectUserFromSearch = async (selectedUser) => {
        if (!currentUser || !selectedUser) return;

        const currentUid = currentUser._id;
        const selectedUid = selectedUser._id;
        const existingConversation =conversations.find(conv => conv.participants.includes(currentUid) && conv.participants.includes(selectedUid)
        );
        if(existingConversation){
            // Use existing conversation
            setSelectedConversationId(existingConversation.id);
            setOtherUser(selectedUser);
            setShowChatOnMobile(true);
        }else{
            const conversationId = createConversationId(currentUid, selectedUid);
            setOtherUser(selectedUser); // Set the selected user for chat window
            setSelectedConversationId(conversationId);
            setShowChatOnMobile(true);

        }

 
    };
      const useConnections = () => {
        const [connections, setConnections] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
      
        useEffect(() => {
          setLoading(true);
          setError(null);
          
          const fetchConnections = async () => {
            try {
              const response = await axios.get(`${BASE_URL}/user/connections`, {
        
                withCredentials:true
              });
               console.log(response.data.connections)
               setConnections(response.data.connections);
      
              // Using placeholder data for now
              //await new Promise(resolve => setTimeout(resolve, 500)); 
              //setConnections(fakeConnections);
      
            } catch (err) {
              console.error("Error fetching connections:", err);
              setError(err.message);
              setConnections([]); // Clear connections on error
            } finally {
              setLoading(false);
            }
          };
      
          fetchConnections();
        }, []); // Fetch only once on mount
      
        return { connections, loading, error };
      };
      const { connections, loading, error } = useConnections();




    return (
        
        <div className=" bg-[#f4f2ee] h-[calc(100vh-var(--navbar-height,64px))] flex flex-col items-center overflow-hidden  "> 
            <Header notifications={notifications} />
            {/* Conversation List (Left Sidebar) */}
             {/* Conditional rendering for mobile: hide list when chat is shown */}
             <div className="w-2/3 max-[1100px]:w-[90%] max-[600px]:w-full h-full flex flex-row bg-white mt-16 rounded-lg shadow-lg border border-gray-400 overflow-hidden">
            <div className={`
                ${showChatOnMobile ? 'hidden md:flex' : 'flex'}
                flex-col flex-grow
             `}>
               <ConversationList
                   selectedConversationId={selectedConversationId}
                   onSelectConversation={handleSelectConversation}
                   currentUser={currentUser}
                   connections={connections}
                   loading={loading}
                   error={error}
                   conversations={conversations}
                   loadingConversations={loadingConversations}
                   errorConversations={errorConversations}
                   onSelectUserFromSearch={handleSelectUserFromSearch}
               />
            </div>


            {/* Chat Window (Right Side) */}
            {/* Conditional rendering for mobile: hide chat when list is shown */}
            <div className={`
                ${showChatOnMobile ? 'flex' : 'hidden md:flex '}
                flex-grow flex-col h-full
             `}>
                <ChatWindow
                    key={selectedConversationId} // Force re-mount or reset state when ID changes
                    conversationId={selectedConversationId}
                    currentUser={currentUser}
                    otherUser={otherUser}
                    onBack={handleBackToList} // Pass the back handler
                />
            </div>
            </div>
        </div>
    );
};

export default MessagingPage;