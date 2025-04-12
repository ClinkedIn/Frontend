
import React, { useState, useEffect, useMemo ,useCallback} from 'react';
import { db } from '../../../firebase';
import { collection, query, where, orderBy, onSnapshot,doc,updateDoc } from 'firebase/firestore';
import ConversationSearch from './SearchBar';
import ConversationListItem from './ConversationListItem';

const ConversationList = ({
    selectedConversationId,
    onSelectConversation,
    currentUser,
    connections,
    loading,
    error,
    conversations,
    loadingConversations,
    errorConversations,
    onSelectUserFromSearch
}) => {
        // Handler for Marking Read/Unread
        const handleMarkReadUnread = useCallback(async (conversationId, markAsUnread) => {
            if (!currentUser?.uid || !conversationId) return;
    
            console.log(`Marking conversation ${conversationId} as ${markAsUnread ? 'UNREAD' : 'READ'}`);
            const conversationDocRef = doc(db, 'conversations', conversationId);
            // Set count to 1 if marking unread, 0 if marking read
            const newUnreadValue = markAsUnread ? 1 : 0;
    
            try {
                await updateDoc(conversationDocRef, {
                    
                    [`unreadCounts.${currentUser.uid}`]: newUnreadValue
                });
                console.log(`Successfully updated unread count for ${currentUser.uid} in ${conversationId}`);
                
            } catch (error) {
                console.error("Error updating unread status:", error);
                
            }
        }, [currentUser?.uid]); // Dependency: currentUser.uid

    return (
        <div className="w-full  md:border-r h-full flex flex-col bg-white">
            {/* Header/Search Area */}
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Messaging</h2>

            </div>
            <ConversationSearch 
            onSelectUser={onSelectUserFromSearch} 
            connections={connections}
            loading={loading}
            error={error}
            />

            {/* Conversation List Area */}
            <div className="flex-grow overflow-y-auto">
                {loadingConversations && <div className="p-4 text-center text-gray-500">Loading chats...</div>}
                {errorConversations && <div className="p-4 text-center text-red-500">{errorConversations}</div>}
                {!loadingConversations && conversations.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No conversations yet. Search for a connection to start chatting.</div>
                )}

                {!loadingConversations && conversations.map(convo => {
                    const otherUserId = convo.participants.find(id => id !== currentUser.uid);
                    const otherUserInfo = otherUserId ? connections.find(user => user.userId === otherUserId) : null; 
                    
                    
                    return (
                        <ConversationListItem
                            key={convo.id}
                            conversation={convo}
                            currentUser={currentUser}
                            otherUserInfo={otherUserInfo} 
                            isSelected={convo.id === selectedConversationId}
                            onClick={() => onSelectConversation(convo.id,otherUserInfo)}
                            onMarkReadUnread={handleMarkReadUnread}
                        />
                    );
                })}
                
                {loading && conversations.length > 0 && <div className="p-2 text-center text-xs text-gray-400">Loading user details...</div>}
                {error && <div className="p-2 text-center text-xs text-red-400">Error loading user details.</div>}
            </div>
        </div>
    );
};

export default ConversationList;