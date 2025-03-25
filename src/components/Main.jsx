import React, { useState, useEffect } from 'react';
import PostMenu from './PostMenu.jsx';

const Main = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState('');
  
  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Attempting to fetch posts...");
        const response = await fetch('/api/posts');
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        console.log("Data received:", data);
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            id: "user456", // This would normally come from auth context
            name: "Hamsa Saber", 
            headline: "Software Engineer at Tech Company",
            profileImage: "https://picsum.photos/80?random=1",
          },
          content: {
            text: postContent,
            media: [] // You can add media handling later
          },
          visibility: "public"
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const data = await response.json();
      setPosts([data.post, ...posts]);
      setPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    }
  };
  
  // Handle reacting to a post
  const handleReact = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reactionType: 'like', // Default reaction type
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to react to post');
      }
      
      const data = await response.json();
      
      // Update the specific post in the posts array
      setPosts(
        posts.map((post) => (post.id === postId ? data.post : post))
      );
    } catch (err) {
      console.error('Error reacting to post:', err);
    }
  };
  
  // Handle PostMenu actions
  const handleHidePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleSavePost = (postId) => {
    console.log(`Post ${postId} saved`);
    alert(`Post saved successfully!`);
  };

  const handleReportPost = (postId) => {
    console.log(`Post ${postId} reported`);
    alert(`Post reported. Thank you for helping keep LinkedIn safe.`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) return <div className="grid-area-main">Loading posts...</div>;
  if (error) return <div className="grid-area-main">{error}</div>;

  return (
    <div className="grid-area-main">
      <div className="overflow-hidden text-center mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
        <div className="flex flex-col text-[#958b7b] mb-2 bg-white">
          <div className="flex items-center p-2 pl-4 pr-4">
            <img
              src="https://picsum.photos/80?random=1" // Use the dummy user profile image
              alt="user"
              className="w-12 h-12 rounded-full mr-2"
            />
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Start a post"
              className="text-[rgba(0,0,0,0.6)] outline-none min-h-[48px] leading-1.5 text-sm font-semibold flex items-center p-2 pl-4 flex-grow border border-[rgba(0,0,0,0.15)] rounded-[35px]"
            />
          </div>

          <div className="flex justify-around flex-wrap p-1 pb-1">
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/photo-icon.svg" alt="pic" className="mr-2.5 ml-[-0.5rem]" />
              <span>Photo</span>
            </button>
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/vedio-icon.svg" alt="vedio" className="mr-2.5 ml-[-0.5rem]" />
              <span>Video</span>
            </button>
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/job-icon.svg" alt="job" className="mr-2.5 ml-[-0.5rem]" />
              <span>Job</span>
            </button>
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/article-icon.svg" alt="article" className="mr-2.5 ml-[-0.5rem]" />
              <span>Write article</span>
            </button>
            <button 
              onClick={handleCreatePost}
              disabled={!postContent.trim()}
              className={`text-white outline-none border-none min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 px-4 rounded-md ${postContent.trim() ? 'bg-[#0a66c2] hover:bg-[#084482]' : 'bg-[#0a66c2]/50 cursor-not-allowed'}`}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {posts.map((post) => (
        <article key={post.id} className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
          <div className="p-3 pr-10 pb-0 flex justify-between items-start relative">
            <a href="/feed" className="overflow-hidden flex">
              <img src={post.author.profileImage} alt="user" className="w-12 h-12 rounded-full mr-2.5" />
              <div className="text-start">
                <h6 className="text-base text-black font-semibold">{post.author.name}</h6>
                <span className="text-sm text-[rgba(0,0,0,0.6)] block">{post.author.headline}</span>
                <span className="text-sm text-[rgba(0,0,0,0.6)] block">{formatDate(post.timestamp)}</span>
              </div>
            </a>
            
            {/* Using the PostMenu component instead of the simple button */}
            <PostMenu
              postId={post.id}
              onHide={handleHidePost}
              onSave={handleSavePost}
              onReport={handleReportPost}
            />
          </div>
          <div className="text-base text-start p-0 pl-4 pr-4 text-[rgba(0,0,0,0.9)] overflow-hidden">
            {post.content.text}
          </div>
          {post.content.media && post.content.media.length > 0 && (
            <div className="w-full relative bg-[#f9fafb] mt-2">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img 
                  src={post.content.media[0].url} 
                  alt={post.content.media[0].alt || "Post image"} 
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          <ul className="flex justify-between mx-4 p-2 border-b border-[#e9e5df] text-sm overflow-auto">
            <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
              <span>{post.metrics.likes}</span>
            </li>
            <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
              <p>{post.metrics.comments} comments</p>
            </li>
          </ul>
          <div className="p-0 px-4 flex justify-between min-h-[40px] overflow-hidden">
            <button 
              onClick={() => handleReact(post.id)}
              className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold"
            >
              <img className="unLiked" src="/Images/like.svg" alt="like" />
              <span>Like</span>
            </button>
            <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
              <img src="/Images/comment.svg" alt="comment" />
              <span>Comment</span>
            </button>
            <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
              <img src="/Images/share.svg" alt="share" />
              <span>Share</span>
            </button>
            <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
              <img src="/Images/send.svg" alt="send" />
              <span>Send</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Main;