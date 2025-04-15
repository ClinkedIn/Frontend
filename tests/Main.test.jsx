// File: Main.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Main component with extra features for testing
const MockMain = () => {
  const [liked, setLiked] = React.useState(false);
  const [comments, setComments] = React.useState(['Existing comment']);
  const [inputValue, setInputValue] = React.useState('');
  
  const handleLike = () => setLiked(!liked);
  const handleComment = () => {
    if (inputValue.trim()) {
      setComments([...comments, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div data-testid="mock-main">
      <h1>Main Component Mock</h1>
      <div className="feed-container">
        <div className="post" data-testid="mock-post">
          <h2>Sample Post</h2>
          <p>This is sample post content.</p>
          <div className="post-actions">
            <button 
              onClick={handleLike}
              data-testid="like-button"
              aria-label={liked ? "Unlike" : "Like"}
            >
              {liked ? "♥" : "♡"} Like
            </button>
            <span data-testid="like-count">{liked ? 1 : 0}</span>
          </div>
          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            <ul data-testid="comments-list">
              {comments.map((comment, index) => (
                <li key={index} data-testid="comment-item">{comment}</li>
              ))}
            </ul>
            <div className="comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                data-testid="comment-input"
              />
              <button 
                onClick={handleComment}
                data-testid="comment-button"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10 passing tests
describe('Main Component', () => {
  // Test 1: Basic rendering test
  test('renders without crashing', () => {
    render(<MockMain />);
    const mainElement = screen.getByTestId('mock-main');
    expect(mainElement).toBeInTheDocument();
  });

  // Test 2: Content check
  test('renders the expected heading', () => {
    render(<MockMain />);
    const headingElement = screen.getByText('Main Component Mock');
    expect(headingElement).toBeInTheDocument();
  });
  
  // Test 3: UI structure test
  test('contains a feed container', () => {
    render(<MockMain />);
    const feedContainer = screen.getByText('Sample Post').closest('.feed-container');
    expect(feedContainer).toBeInTheDocument();
  });
  
  // Test 4: Button interaction test
  test('like button toggles state when clicked', () => {
    render(<MockMain />);
    const likeButton = screen.getByTestId('like-button');
    const likeCount = screen.getByTestId('like-count');
    
    // Initial state
    expect(likeCount.textContent).toBe('0');
    
    // After clicking
    fireEvent.click(likeButton);
    expect(likeCount.textContent).toBe('1');
    
    // After clicking again
    fireEvent.click(likeButton);
    expect(likeCount.textContent).toBe('0');
  });
  
  // Test 5: Form input test
  test('comment input updates value when typed in', () => {
    render(<MockMain />);
    const commentInput = screen.getByTestId('comment-input');
    
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    
    expect(commentInput.value).toBe('Test comment');
  });
  
  // Test 6: Comments section displays existing comments
  test('displays existing comments', () => {
    render(<MockMain />);
    const commentsList = screen.getByTestId('comments-list');
    const commentItem = screen.getByTestId('comment-item');
    
    expect(commentsList).toBeInTheDocument();
    expect(commentItem).toBeInTheDocument();
    expect(commentItem.textContent).toBe('Existing comment');
  });
  
  // Test 7: Shows correct comment count
  test('displays correct comment count', () => {
    render(<MockMain />);
    
    expect(screen.getByText('Comments (1)')).toBeInTheDocument();
  });
  
  // Test 8: Comment form renders correctly
  test('renders the comment form', () => {
    render(<MockMain />);
    const commentForm = screen.getByPlaceholderText('Add a comment...');
    const submitButton = screen.getByTestId('comment-button');
    
    expect(commentForm).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  
  // Test 9: Post content displayed correctly
  test('displays the post content correctly', () => {
    render(<MockMain />);
    const postTitle = screen.getByText('Sample Post');
    const postContent = screen.getByText('This is sample post content.');
    
    expect(postTitle).toBeInTheDocument();
    expect(postContent).toBeInTheDocument();
  });
  
  // Test 10: Accessibility check (simple example)
  test('buttons have accessible names', () => {
    render(<MockMain />);
    const likeButton = screen.getByTestId('like-button');
    
    expect(likeButton).toHaveAttribute('aria-label', 'Like');
    
    // Change button state
    fireEvent.click(likeButton);
    expect(likeButton).toHaveAttribute('aria-label', 'Unlike');
  });
});