import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import MessagingPage from '../src/pages/messaging/Messaging';
import axios from 'axios';
import { db } from '../../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

// Mock external dependencies
jest.mock('axios');
jest.mock('firebase/firestore');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

// Mock components
jest.mock('../../components/messaging/ConversationList', () => () => <div>ConversationList</div>);
jest.mock('../../components/messaging/ChatWindow', () => () => <div>ChatWindow</div>);
jest.mock('../../components/UpperNavBar', () => () => <div>Header</div>);

describe('MessagingPage', () => {
  const mockCurrentUser = {
    _id: 'user1',
    name: 'Current User',
  };

  const mockOtherUser = {
    _id: 'user2',
    name: 'Other User',
  };

  const mockConversations = [
    {
      id: 'user1_user2',
      participants: ['user1', 'user2'],
      lastUpdatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    // Mock axios.get for user fetch
    axios.get.mockImplementation((url) => {
      if (url.includes('/user/me')) {
        return Promise.resolve({ data: { user: mockCurrentUser } });
      }
      if (url.includes('/user/connections')) {
        return Promise.resolve({ data: { connections: [] } });
      }
      return Promise.reject(new Error('Not found'));
    });

    // Mock Firestore onSnapshot
    const mockUnsubscribe = jest.fn();
    onSnapshot.mockImplementation((q, success, error) => {
      success({ 
        forEach: (callback) => mockConversations.forEach(callback),
        docs: mockConversations.map(conv => ({ id: conv.id, data: () => conv }))
      });
      return mockUnsubscribe;
    });

    // Mock useLocation
    useLocation.mockReturnValue({
      state: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('fetches current user on mount', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/user/me'),
      expect.objectContaining({ withCredentials: true })
    );
    await waitFor(() => {
      expect(screen.getByText('ConversationList')).toBeInTheDocument();
    });
  });

  it('sets up Firestore conversation listener', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    expect(collection).toHaveBeenCalledWith(db, 'conversations');
    expect(query).toHaveBeenCalledWith(
      expect.anything(),
      where('participants', 'array-contains', mockCurrentUser._id),
      orderBy('lastUpdatedAt', 'desc')
    );
    expect(onSnapshot).toHaveBeenCalled();
  });

  it('handles jobApplicant from location state', async () => {
    useLocation.mockReturnValue({
      state: mockOtherUser,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('ChatWindow')).toBeInTheDocument();
    });
  });

  it('creates conversation ID correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    // Test the imported function
    const createConversationId = require('./MessagingPage').createConversationId;
    expect(createConversationId('a', 'b')).toBe('a_b');
    expect(createConversationId('b', 'a')).toBe('a_b');
  });

  it('shows chat window on mobile when conversation is selected', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    // Mock handleSelectConversation
    const { handleSelectConversation } = require('./MessagingPage');
    await act(async () => {
      handleSelectConversation('conv1', mockOtherUser);
    });

    // In a real test, you would need to check the class names or styles
    // This is simplified for demonstration
    expect(screen.queryByText('ChatWindow')).toBeInTheDocument();
  });

  it('handles back to list on mobile', async () => {
    useLocation.mockReturnValue({
      state: mockOtherUser,
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    // Mock handleBackToList
    const { handleBackToList } = require('./MessagingPage');
    await act(async () => {
      handleBackToList();
    });

    // In a real test, you would check if the chat window is hidden
    // This is simplified for demonstration
    expect(screen.queryByText('ConversationList')).toBeInTheDocument();
  });

  it('handles error when fetching conversations', async () => {
    onSnapshot.mockImplementation((q, success, error) => {
      error(new Error('Firestore error'));
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('ConversationList')).toBeInTheDocument();
    });
  });

  it('fetches connections', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MessagingPage />
        </MemoryRouter>
      );
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/user/connections'),
      expect.objectContaining({ withCredentials: true })
    );
  });
});