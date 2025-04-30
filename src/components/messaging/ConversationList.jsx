
import React, { useState, useEffect, useMemo ,useCallback} from 'react';
import { db } from '../../../firebase';
import { collection, query, where, orderBy, onSnapshot,doc,updateDoc } from 'firebase/firestore';
import ConversationSearch from './SearchBar';
import ConversationListItem from '../../components/messaging/ConversationListitem';

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
        /**
         * Handles marking a conversation as read or unread for the current user.
         *
         * @function
         * @param {string} conversationId - The ID of the conversation to update.
         * @param {boolean} markAsUnread - A flag indicating whether to mark the conversation as unread (true) or read (false).
         * @returns {Promise<void>} A promise that resolves when the unread count is successfully updated, or logs an error if the update fails.
         * @throws Will log an error if the update to the database fails.
         *
         * @example
         * handleMarkReadUnread('conversation123', true); // Marks the conversation as unread
         * handleMarkReadUnread('conversation123', false); // Marks the conversation as read
         */
        const handleMarkReadUnread = useCallback(async (conversationId, markAsUnread) => {
            if (!currentUser?._id || !conversationId) return;
    
            console.log(`Marking conversation ${conversationId} as ${markAsUnread ? 'UNREAD' : 'READ'}`);
            const conversationDocRef = doc(db, 'conversations', conversationId);
            // Set count to 1 if marking unread, 0 if marking read
            const newUnreadValue = markAsUnread ? 1 : 0;
    
            try {
                await updateDoc(conversationDocRef, {
                    
                    [`unreadCounts.${currentUser._id}`]: newUnreadValue,
                    ['forceUnread']: markAsUnread ? true : false,
                });
                console.log(`Successfully updated unread count for ${currentUser._id} in ${conversationId}`);
                
            } catch (error) {
                console.error("Error updating unread status:", error);
                
            }
        }, [currentUser?._id]); // Dependency: currentUser.uid

    return (
        <div className="w-full  md:border-r md:border-gray-400 h-full flex flex-col bg-white">
            {/* Header/Search Area */}
            <div className="p-4 border-b border-gray-400">
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
                    const otherUserId = convo.participants.find(id => id !== currentUser._id);
                    const otherUserInfo = otherUserId ? connections.find(user => user._id === otherUserId) : null; 
                    
                    
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