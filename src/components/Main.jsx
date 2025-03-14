import React from 'react';

// Dummy data
const dummyUser = {
  photoURL: '/Images/user.svg',
  displayName: 'Jane Doe',
  email: 'jane.doe@example.com',
};

const dummyPosts = [
  {
    user: {
      name: 'John Smith',
      title: 'john.smith@example.com',
      photo: '/Images/user.svg',
    },
    date: new Date(),
    description: 'This is a dummy post about my recent project!',
    sharedImage: '/Images/dummy-image.jpg', // Placeholder image
    sharedVedio: '',
    comments: [],
    likes: [],
    postID: '1',
  },
  {
    user: {
      name: 'Alice Johnson',
      title: 'alice.johnson@example.com',
      photo: '/Images/user.svg',
    },
    date: new Date(),
    description: 'Another dummy post with some text content.',
    sharedImage: '',
    sharedVedio: '',
    comments: [],
    likes: [],
    postID: '2',
  },
];

const Main = () => {
  return (
    <div className="grid-area-main">
      <div className="overflow-hidden text-center mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
        <div className="flex flex-col text-[#958b7b] mb-2 bg-white">
          <div className="flex items-center p-2 pl-4 pr-4">
            <img
              src={dummyUser.photoURL}
              alt="user"
              className="w-12 h-12 rounded-full mr-2"
            />
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-[35px] flex-grow pl-4 border border-[rgba(0,0,0,0.15)]">
              Start a post
            </button>
          </div>

          <div className="flex justify-around flex-wrap p-1 pb-1">
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/photo-icon.svg" alt="pic" className="mr-2.5 ml-[-0.5rem]" />
              <span>Photo</span>
            </button>
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/vedio-icon.svg" alt="vedio" className="mr-2.5 ml-[-0.5rem]" />
              <span>Vedio</span>
            </button>
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/job-icon.svg" alt="job" className="mr-2.5 ml-[-0.5rem]" />
              <span>Job</span>
            </button>
            <button className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md">
              <img src="/Images/article-icon.svg" alt="article" className="mr-2.5 ml-[-0.5rem]" />
              <span>Write article</span>
            </button>
          </div>
        </div>
      </div>

      {dummyPosts.map((post, id) => (
        <article key={id} className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
          <div className="p-3 pr-10 pb-0 flex justify-between items-start relative">
            <a href="/feed" className="overflow-hidden flex">
              <img src={post.user.photo} alt="user" className="w-12 h-12 rounded-full mr-2.5" />
              <div className="text-start">
                <h6 className="text-base text-black font-semibold">{post.user.name}</h6>
                <span className="text-sm text-[rgba(0,0,0,0.6)] block">{post.user.title}</span>
                <span className="text-sm text-[rgba(0,0,0,0.6)] block">Just now</span>
              </div>
            </a>
            <button className="bg-transparent border-none cursor-pointer p-1.25 rounded-full hover:bg-[rgba(0,0,0,0.08)] transition duration-200">
              <img src="/Images/ellipsis.svg" alt="ellipsis" className="w-full h-full" />
            </button>
          </div>
          <div className="text-base text-start p-0 pl-4 pr-4 text-[rgba(0,0,0,0.9)] overflow-hidden">
            {post.description}
          </div>
          <div className="w-full max-h-[500px] relative bg-[#f9fafb] mt-2 overflow-hidden">
            {post.sharedImage && <img src={post.sharedImage} alt="postIMG" className="max-h-[500px] max-w-full" />}
          </div>
          <ul className="flex justify-between mx-4 p-2 border-b border-[#e9e5df] text-sm overflow-auto">
            <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
              <span>0</span>
            </li>
            <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
              <p>0 comments</p>
            </li>
          </ul>
          <div className="p-0 px-4 flex justify-between min-h-[40px] overflow-hidden">
            <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
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