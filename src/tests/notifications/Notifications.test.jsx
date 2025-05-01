import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Use userEvent for simulating interactions
import axios from 'axios';
// Assuming react-router-dom v6 hooks
import { useNavigate } from 'react-router-dom';

import Notification from '../../pages/notifications/Notifications'; // Adjust path
import { BASE_URL } from '../../constants'; // Adjust path

// --- Mock Dependencies using vi.mock ---

// Mock axios
vi.mock('axios');

// Mock react-router-dom
// We need to mock the specific hook used
// Mock react-router-dom (This looks correct)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --- FIX IS HERE ---
// Define the mock functions *before* vi.mock
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    // Wrap the calls in functions to defer execution
    success: (...args) => mockToastSuccess(...args),
    error: (...args) => mockToastError(...args),
  },
  // Simple mock component for Toaster
  Toaster: () => <div data-testid="toaster-mock"></div>,
}));
// --- END OF FIX ---


// Mock Child Components using vi.mock
// Mocking implementation returns a simple component
vi.mock('../../components/UpperNavBar', () => ({
  default: () => <div data-testid="header-mock">Header</div>
}));
vi.mock('../../components/ProfileCard', () => ({
  default: ({ user }) => (
    <div data-testid="profile-card-mock">
      ProfileCard: {user?.username || 'Loading...'}
    </div>
  )
}));
vi.mock('../../components/Notification/NotificationCard', () => ({
  // Mock NotificationCard to render basic info and call the click handler via a button
  default: ({ notification, handleNotificationClick }) => (
    <li data-testid={`notification-${notification._id}`}>
      <div data-testid={`notification-content-${notification._id}`}>
        {notification.message} ({notification.type} / {notification.subType || 'none'}) - Read: {notification.isRead.toString()}
      </div>
      {/* Button to easily trigger the passed handler */}
      <button onClick={handleNotificationClick}>Mark Read Trigger</button>
    </li>
  )
}));
vi.mock('../../components/FooterLinks', () => ({
    default: () => <div data-testid="footer-links-mock">FooterLinks</div>
}));


// --- Test Data --- (Keep the same)
const mockUser = {
  _id: 'user123',
  username: 'TestUser',
};

const mockNotifications = [
  { _id: 'notif1', message: 'Job Alert: New Role Available!', type: 'job', subType: null, isRead: false, createdAt: new Date().toISOString() },
  { _id: 'notif2', message: 'Someone commented on your post.', type: 'post', subType: 'comments', isRead: false, createdAt: new Date().toISOString() },
  { _id: 'notif3', message: 'Your post got a reaction.', type: 'post', subType: 'reactions', isRead: true, createdAt: new Date().toISOString() },
  { _id: 'notif4', message: 'UserX mentioned you.', type: 'mention', subType: null, isRead: false, createdAt: new Date().toISOString() },
  { _id: 'notif5', message: 'Another post reaction.', type: 'post', subType: 'reactions', isRead: false, createdAt: new Date().toISOString() },
  { _id: 'notif6', message: 'Someone reposted your content.', type: 'post', subType: 'reposts', isRead: false, createdAt: new Date().toISOString() },
];

// --- Test Suite using Vitest ---

describe('Notification Component', () => {
  // Use vi.mocked to wrap the mocked module for type safety and easier access to mock functions
  const mockedAxiosGet = vi.mocked(axios.get);
  const mockedAxiosPatch = vi.mocked(axios.patch);
  const mockedAxiosPost = vi.mocked(axios.post);

  beforeEach(() => {
    // Reset mocks before each test
    mockedAxiosGet.mockReset();
    mockedAxiosPatch.mockReset();
    mockedAxiosPost.mockReset();
    mockNavigate.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();

    // Default mock implementations for initial fetch
    mockedAxiosGet.mockImplementation(async (url) => {
      if (url === `${BASE_URL}/user/me`) {
        return { data: mockUser };
      }
      if (url === `${BASE_URL}/notifications`) {
        return { data: mockNotifications };
      }
      throw new Error(`Unhandled GET request: ${url}`);
    });

    // Default mock for patch
    mockedAxiosPatch.mockResolvedValue({ status: 200 });
    // Default mock for post (test notification)
    mockedAxiosPost.mockResolvedValue({ status: 200 });
  });

  it('renders initial layout and fetches data on mount', async () => {
    render(<Notification />);

    // Check for mocks of child components
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('profile-card-mock')).toBeInTheDocument();
    expect(screen.getByTestId('toaster-mock')).toBeInTheDocument();

    // Check initial loading state for profile card
    expect(screen.getByText('ProfileCard: Loading...')).toBeInTheDocument();

    // Wait for API calls and state updates
    await waitFor(() => {
      expect(mockedAxiosGet).toHaveBeenCalledWith(`${BASE_URL}/user/me`, { withCredentials: true });
      expect(mockedAxiosGet).toHaveBeenCalledWith(`${BASE_URL}/notifications`, { withCredentials: true });
    });

    // Check profile card updated with user data
    await waitFor(() => {
      expect(screen.getByText(`ProfileCard: ${mockUser.username}`)).toBeInTheDocument();
    });

    // Check if notifications are rendered (based on mock data)
    await waitFor(() => {
      expect(screen.getByTestId('notification-notif1')).toBeInTheDocument();
      expect(screen.getByTestId('notification-notif2')).toBeInTheDocument();
      expect(screen.getByTestId('notification-notif3')).toBeInTheDocument();
      expect(screen.getByTestId('notification-notif4')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(mockNotifications.length);
    });

    // Check filter tabs are present
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jobs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /My Posts/ })).toBeInTheDocument(); // Initial state
    expect(screen.getByRole('button', { name: 'Mentions' })).toBeInTheDocument();
  });

  it('filters notifications by "Jobs"', async () => {
    const user = userEvent.setup(); // Setup userEvent
    render(<Notification />);
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(mockNotifications.length);
    }); // Wait for initial render

    const jobsButton = screen.getByRole('button', { name: 'Jobs' });
    await user.click(jobsButton);

    // Check highlighting
    expect(jobsButton).toHaveClass('bg-[#004c33] text-white');
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass('bg-[#004c33] text-white');

    // Check filtered notifications
    await waitFor(() => {
      expect(screen.getByTestId('notification-notif1')).toBeInTheDocument(); // The job notification
      expect(screen.queryByTestId('notification-notif2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notification-notif4')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1); // Only one job notification
    });
  });

  it('filters notifications by "Mentions"', async () => {
    const user = userEvent.setup();
    render(<Notification />);
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(mockNotifications.length);
    });

    const mentionsButton = screen.getByRole('button', { name: 'Mentions' });
    await user.click(mentionsButton);

    expect(mentionsButton).toHaveClass('bg-[#004c33] text-white');

    await waitFor(() => {
      expect(screen.getByTestId('notification-notif4')).toBeInTheDocument(); // The mention notification
      expect(screen.queryByTestId('notification-notif1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('notification-notif2')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1); // Only one mention notification
    });
  });

  describe('Post Filtering', () => {
    it('filters notifications by "My Posts" (all posts) initially', async () => {
      const user = userEvent.setup();
      render(<Notification />);
      await waitFor(() => {
        expect(screen.getAllByRole('listitem')).toHaveLength(mockNotifications.length);
      });

      const postsButton = screen.getByRole('button', { name: 'My Posts' });
      await user.click(postsButton);

      expect(postsButton).toHaveClass('bg-[#004c33] text-white');
      expect(postsButton).toHaveTextContent('My Posts ▼'); // Check arrow appears

      const postNotifications = mockNotifications.filter(n => n.type === 'post');
      await waitFor(() => {
        expect(screen.getByTestId('notification-notif2')).toBeInTheDocument();
        expect(screen.getByTestId('notification-notif3')).toBeInTheDocument();
        expect(screen.getByTestId('notification-notif5')).toBeInTheDocument();
        expect(screen.getByTestId('notification-notif6')).toBeInTheDocument();
        expect(screen.queryByTestId('notification-notif1')).not.toBeInTheDocument(); // Job
        expect(screen.queryByTestId('notification-notif4')).not.toBeInTheDocument(); // Mention
        expect(screen.getAllByRole('listitem')).toHaveLength(postNotifications.length);
      });
    });

    it('opens and closes post sub-filter dropdown', async () => {
      const user = userEvent.setup();
      render(<Notification />);
      await waitFor(() => { // wait for initial load
        expect(screen.getByTestId('notification-notif1')).toBeInTheDocument();
      });

      const postsButton = screen.getByRole('button', { name: 'My Posts' });

      // First click: Select "My Posts" filter and show arrow
      await user.click(postsButton);
      expect(postsButton).toHaveTextContent('My Posts ▼');
      expect(screen.queryByText('Filter post activity')).not.toBeInTheDocument(); // Dropdown not yet open

      // Second click: Open dropdown
      await user.click(postsButton);
      await waitFor(() => {
        expect(screen.getByText('Filter post activity')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Comments' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reactions' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reposts' })).toBeInTheDocument();
      });

      // Click an option to close it
      const commentsOption = screen.getByRole('button', { name: 'Comments' });
      await user.click(commentsOption);
      await waitFor(() => {
        expect(screen.queryByText('Filter post activity')).not.toBeInTheDocument();
      });
    });

    it('filters by post sub-type "Comments"', async () => {
      const user = userEvent.setup();
      render(<Notification />);
      await waitFor(() => { // wait for initial load
        expect(screen.getByTestId('notification-notif1')).toBeInTheDocument();
      });

      const postsButton = screen.getByRole('button', { name: 'My Posts' });
      await user.click(postsButton); // Select post filter
      await user.click(postsButton); // Open dropdown

      await waitFor(() => expect(screen.getByText('Filter post activity')).toBeInTheDocument());

      const commentsOption = screen.getByRole('button', { name: 'Comments' });
      await user.click(commentsOption);

      // Check dropdown closed and button text updated
      expect(screen.queryByText('Filter post activity')).not.toBeInTheDocument();
      expect(postsButton).toHaveTextContent('My Posts | Comments ▼');

      // Check filtered items
      await waitFor(() => {
        expect(screen.getByTestId('notification-notif2')).toBeInTheDocument(); // The comments notification
        expect(screen.queryByTestId('notification-notif3')).not.toBeInTheDocument(); // Reaction
        expect(screen.queryByTestId('notification-notif5')).not.toBeInTheDocument(); // Reaction
        expect(screen.queryByTestId('notification-notif6')).not.toBeInTheDocument(); // Repost
        expect(screen.getAllByRole('listitem')).toHaveLength(1);
      });
    });

     it('filters by post sub-type "Reactions"', async () => {
        const user = userEvent.setup();
        render(<Notification />);
        await waitFor(() => { // wait for initial load
             expect(screen.getByTestId('notification-notif1')).toBeInTheDocument();
        });

        const postsButton = screen.getByRole('button', { name: 'My Posts' });
        await user.click(postsButton); // Select post filter
        await user.click(postsButton); // Open dropdown

        await waitFor(() => expect(screen.getByText('Filter post activity')).toBeInTheDocument());

        const reactionsOption = screen.getByRole('button', { name: 'Reactions' });
        await user.click(reactionsOption);

        expect(postsButton).toHaveTextContent('My Posts | Reactions ▼');

        const reactionNotifications = mockNotifications.filter(n => n.subType === 'reactions');
        await waitFor(() => {
            expect(screen.getByTestId('notification-notif3')).toBeInTheDocument();
            expect(screen.getByTestId('notification-notif5')).toBeInTheDocument();
            expect(screen.queryByTestId('notification-notif2')).not.toBeInTheDocument();
            expect(screen.queryByTestId('notification-notif6')).not.toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(reactionNotifications.length);
        });
    });

  });

  it('marks notification as read on click', async () => {
    const user = userEvent.setup();
    render(<Notification />);
    await waitFor(() => { // Wait for notifications to load
      expect(screen.getByTestId('notification-notif2')).toBeInTheDocument();
    });

    const notificationItem = screen.getByTestId('notification-notif2');
    // Find the specific button within the mocked NotificationCard
    const markReadTrigger = notificationItem.querySelector('button');

    expect(markReadTrigger).toBeInTheDocument(); // Ensure button exists
    expect(screen.getByTestId('notification-content-notif2')).toHaveTextContent('Read: false'); // Check initial state

    // Mock the patch response specifically for this ID (can be done inside test too)
    mockedAxiosPatch.mockResolvedValueOnce({ status: 200 });

    await user.click(markReadTrigger); // Use userEvent to click

    // Check if API was called
    await waitFor(() => {
      expect(mockedAxiosPatch).toHaveBeenCalledWith(
        `${BASE_URL}/notifications/mark-read/notif2`,
        {}, // Empty body
        { withCredentials: true }
      );
    });

    // Check if the UI updates (due to state change triggered by successful patch)
    await waitFor(() => {
      expect(screen.getByTestId('notification-content-notif2')).toHaveTextContent('Read: true');
    });
  });

  it('handles "Send Test Notification" button click', async () => {
    const user = userEvent.setup();
    // Reset get count before this specific test - tricky with vi.mocked, better check call count delta
    const initialGetCalls = mockedAxiosGet.mock.calls.length;

    render(<Notification />);
    await waitFor(() => { // Ensure initial data is loaded
      expect(mockedAxiosGet).toHaveBeenCalledTimes(initialGetCalls + 2); // user + initial notifications
    });

    const testButton = screen.getByRole('button', { name: 'Send Test Notification' });
    await user.click(testButton);

    // Check if the mock POST request was sent
    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        '/api/send-notification', // Uses the specific path from the handler
        { title: "Test Notification", body: "This is a test notification!" }
      );
    });

    // Check if fetchNotifications was called again
    await waitFor(() => {
      // Expecting 3 calls relative to start: user, initial notifications, notifications after test send
      expect(mockedAxiosGet).toHaveBeenCalledWith(`${BASE_URL}/notifications`, { withCredentials: true });
      // Check total calls increased by 1 more after the post
      expect(mockedAxiosGet).toHaveBeenCalledTimes(initialGetCalls + 3);
    });

    // Check if success toast was shown
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('New notification received!', { duration: 4000 });
    });
  });

  it('handles failed test notification send', async () => {
    const user = userEvent.setup();
    const initialGetCalls = mockedAxiosGet.mock.calls.length;
    render(<Notification />);
    await waitFor(() => { // Ensure initial data is loaded
      expect(mockedAxiosGet).toHaveBeenCalledTimes(initialGetCalls + 2);
    });

    // Mock the post request to fail
    mockedAxiosPost.mockRejectedValueOnce(new Error('Failed to send'));

    const testButton = screen.getByRole('button', { name: 'Send Test Notification' });
    await user.click(testButton);

    // Check if the mock POST request was sent
    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith(
        '/api/send-notification',
        { title: "Test Notification", body: "This is a test notification!" }
      );
    });

    // Check if error toast was shown
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to send notification');
    });

    // Ensure fetchNotifications was NOT called again after failure
    // Check that the call count hasn't increased beyond the initial + post attempt
    expect(mockedAxiosGet).toHaveBeenCalledTimes(initialGetCalls + 2);

  });

  it('displays "no notifications" message for empty filters', async () => {
    const user = userEvent.setup();
    // Override mock for notifications to return empty array for this test
    mockedAxiosGet.mockImplementation(async (url) => {
      if (url === `${BASE_URL}/user/me`) return { data: mockUser };
      if (url === `${BASE_URL}/notifications`) return { data: [] }; // No notifications
      throw new Error(`Unhandled GET request: ${url}`);
    });

    render(<Notification />);

    // Wait for initial load (even though it's empty)
    await waitFor(() => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });


    // Check "Jobs" tab
    await user.click(screen.getByRole('button', { name: 'Jobs' }));
    await waitFor(() => {
      expect(screen.getByText('No new job notifications')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Explore more jobs' })).toBeInTheDocument();
      expect(screen.getByAltText('No New Notifications')).toBeInTheDocument();
    });

    // Check "My Posts" tab
    await user.click(screen.getByRole('button', { name: /My Posts/ }));
    await waitFor(() => {
      expect(screen.getByText('No new post activities')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View previous activity' })).toBeInTheDocument();
      expect(screen.getByAltText('No New Notifications')).toBeInTheDocument();
    });

    // Check "Mentions" tab
    await user.click(screen.getByRole('button', { name: 'Mentions' }));
    await waitFor(() => {
      expect(screen.getByText('No new mentions')).toBeInTheDocument();
      expect(screen.getByAltText('No New Notifications')).toBeInTheDocument();
    });

     // Check "All" tab
     await user.click(screen.getByRole('button', { name: 'All' }));
     await waitFor(() => {
        // Assuming the last fallback is used when filteredNotifications is empty
        expect(screen.getByText('No New Notifications')).toBeInTheDocument();
        expect(screen.getByAltText('No New Notifications')).toBeInTheDocument();
     });
  });

  it('navigates on profile card click', async () => {
    const user = userEvent.setup();
    render(<Notification />);
    await waitFor(() => expect(screen.getByTestId('profile-card-mock')).toBeInTheDocument());

    const profileCardElement = screen.getByTestId('profile-card-mock');
    const clickableProfileArea = profileCardElement.closest('div[id="Profile-Card"]');

    expect(clickableProfileArea).toBeInTheDocument(); // Make sure it exists
    await user.click(clickableProfileArea); // Click the parent div

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates on "View settings" click', async () => {
    const user = userEvent.setup();
    render(<Notification />);
    const viewSettingsButton = await screen.findByRole('button', { name: 'View settings' });

    await user.click(viewSettingsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates on "Explore more jobs" click when no job notifications', async () => {
    const user = userEvent.setup();
    // Setup empty notifications for this specific test
    mockedAxiosGet.mockImplementation(async (url) => {
     if (url === `${BASE_URL}/user/me`) return { data: mockUser };
     if (url === `${BASE_URL}/notifications`) return { data: [] };
     throw new Error(`Unhandled GET request: ${url}`);
   });

    render(<Notification />);
    await waitFor(() => { // Wait for load
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    await user.click(screen.getByRole('button', { name: 'Jobs' })); // Go to Jobs tab
    const exploreButton = await screen.findByRole('button', { name: 'Explore more jobs' });
    await user.click(exploreButton);

    expect(mockNavigate).toHaveBeenCalledWith('/jobs');
  });

  it('navigates on "View previous activity" click when no post notifications', async () => {
    const user = userEvent.setup();
     // Setup empty notifications for this specific test
     mockedAxiosGet.mockImplementation(async (url) => {
      if (url === `${BASE_URL}/user/me`) return { data: mockUser };
      if (url === `${BASE_URL}/notifications`) return { data: [] };
      throw new Error(`Unhandled GET request: ${url}`);
    });

    render(<Notification />);
    await waitFor(() => { // Wait for load
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    await user.click(screen.getByRole('button', { name: /My Posts/ })); // Go to Posts tab
    const viewActivityButton = await screen.findByRole('button', { name: 'View previous activity' });
    await user.click(viewActivityButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

});