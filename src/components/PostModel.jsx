import React from 'react';

// Dummy data
const dummyUser = {
  photoURL: '/Images/user.svg',
  displayName: 'Jane Doe',
  email: 'jane.doe@example.com',
};

const dummyPost = {
  text: 'This is a dummy post about my recent project! Check out this cool link: https://example.com',
  imageUrl: '/Images/dummy-image.jpg', // Placeholder image path
  videoUrl: '', // Empty for now, can add a dummy video URL later
};

const PostModel = (props) => {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-[9999] bg-[rgba(0,0,0,0.75)] animate-fadeIn">
      <article className="max-w-[552px] max-h-[90%] bg-white rounded-md relative top-8 mx-auto animate-up">
        <div className="flex justify-between items-center p-2.5 pl-5 pr-5 border-b border-[rgba(0,0,0,0.15)]">
          <h2 className="font-semibold text-lg text-[rgba(0,0,0,0.8)]">Create a post</h2>
          <button
            onClick={() => props.close()}
            className="w-10 h-10 bg-white rounded-full cursor-pointer hover:bg-[rgba(0,0,0,0.08)] transition duration-200"
          >
            <img src="/Images/close.svg" alt="close" className="w-full h-full" />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto bg-transparent p-2 pl-5 pr-5">
          <div className="flex items-center p-2.5">
            <img
              src={dummyUser.photoURL}
              alt="user"
              className="w-12 h-12 rounded-full"
            />
            <span className="font-semibold text-base ml-1.25">{dummyUser.displayName}</span>
          </div>

          <div className="p-3">
            <textarea
              value={dummyPost.text}
              readOnly
              className="w-full min-h-[100px] resize-none border-0 outline-0 text-base mb-5 leading-1.5"
              placeholder="What do you want to talk about?"
            ></textarea>
          </div>

          <div className="text-center overflow-y-scroll max-h-[200px] mb-3.75 relative">
            {dummyPost.imageUrl && (
              <img
                src={dummyPost.imageUrl}
                alt="dummy post image"
                className="border border-[rgba(0,0,0,0.1)] rounded-md w-[98%]"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.25 ml-[-6px]">
              <div className="flex gap-1.25">
                <button
                  disabled
                  className="w-10 h-10 rounded-full disabled:contrast-0 disabled:bg-transparent"
                >
                  <img src="/Images/photo-icon.svg" alt="Add a pic" className="w-full h-full" />
                </button>
                <button
                  disabled
                  className="w-10 h-10 rounded-full disabled:contrast-0 disabled:bg-transparent"
                >
                  <img src="/Images/vedio-icon.svg" alt="Add a vedio" className="w-full h-full" />
                </button>
                <button
                  disabled
                  className="w-10 h-10 rounded-full disabled:contrast-0 disabled:bg-transparent"
                >
                  <img src="/Images/document.svg" alt="Add a document" className="w-full h-full" />
                </button>
              </div>
              <div className="border-l border-[rgba(0,0,0,0.15)] pl-1.25 ml-2.5 text-sm">
                <button className="flex items-center rounded-xl text-[#666666] font-semibold p-2 pl-3.5 pr-3.5 hover:bg-[rgba(0,0,0,0.08)] transition duration-200">
                  <img src="/Images/comment.svg" alt="allow comments" className="w-4 mr-1" />
                  Anyone
                </button>
              </div>
            </div>
            <button
              disabled
              className="bg-[#0a66c2] text-white font-semibold text-base p-1.5 pl-4 pr-4 rounded-[25px] hover:bg-[#004182] disabled:bg-[rgba(0,0,0,0.08)] disabled:text-[rgba(0,0,0,0.3)] cursor-not-allowed transition duration-300"
            >
              Post
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostModel;