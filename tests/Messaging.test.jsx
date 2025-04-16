import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useParams } from 'react-router-dom';
import MessagingPage from '../src/pages/messaging/Messaging';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn().mockReturnValue({ id: '123' }),
  };
});


vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, success) => {
    success({
      forEach: (callback) => {
        callback({
          id: '123_234',
          data: () => ({
            participants: ['123', '234'],
            lastUpdatedAt: { toDate: () => new Date() },
            otherUserInfo: {
              userId: '234',
              fullName: 'Ali Abdelghani',
              profilePicture: 'https://example.com/photo.jpg'
            }
          })
        });
      }
    });
    return vi.fn(); 
  }),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

describe('MessagingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <MessagingPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Select a conversation to start messaging.')).toBeInTheDocument();
  });
  test('renders conversation list with participant names', async () => {
    render(
      <MemoryRouter>
        <MessagingPage />
      </MemoryRouter>
    );

    screen.debug();

    await waitFor(() => {
      expect(screen.getByText('Ali Abdelghani')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  
});