import React, { useState } from "react";

interface RightsideProps {}

const hashtags = [
  {
    name: "#Linkedin",
    img: "https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs",
  },
  {
    name: "#Video",
    img: "https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs",
  },
];

const Rightside: React.FC<RightsideProps> = () => {
  const [followed, setFollowed] = useState<{ [key: string]: boolean }>({});

  const handleFollow = (name: string) => {
    setFollowed((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
    // Optionally, trigger follow/unfollow API here
  };

  return (
    <div className="grid-area-rightside">
      <div className="text-center overflow-hidden mb-2 bg-white rounded-md relative border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)] p-3">
        <div className="inline-flex items-center justify-between text-[16.5px] w-full">
          <h2 className="text-[#333] font-bold">Add to your feed</h2>
          <img src="/Images/feed-icon.svg" alt="" />
        </div>

        <ul className="mt-4">
          {hashtags.map((tag) => (
            <li className="flex items-center mb-3 text-sm" key={tag.name}>
              <a href="/feed">
                <div
                  className="bg-contain bg-center bg-no-repeat w-[45px] h-[45px] mr-2"
                  style={{ backgroundImage: `url('${tag.img}')` }}
                ></div>
              </a>
              <div className="flex flex-col text-left gap-1">
                <span>{tag.name}</span>
                <button
                  onClick={() => handleFollow(tag.name)}
                  className={
                    followed[tag.name]
                      ? "bg-[#0a66c2] text-white border-[#0a66c2] py-2 px-4 rounded-full font-semibold flex items-center justify-center max-h-8 max-w-[480px] text-center outline-none text-base transition duration-200"
                      : "bg-transparent text-[rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.6)] py-2 px-4 rounded-full font-semibold flex items-center justify-center max-h-8 max-w-[480px] text-center outline-none text-base transition duration-200 hover:bg-[rgba(0,0,0,0.08)] hover:border-2"
                  }
                >
                  <img src="/Images/plus-icon.svg" alt="plus" className="mr-1" />
                  {followed[tag.name] ? "Following" : "Follow"}
                </button>
              </div>
            </li>
          ))}
        </ul>

        <a href="#" className="text-[#0a66c2] flex items-center text-sm cursor-pointer">
          View all recommendations
          <img src="/Images/right-icon.svg" alt="" className="ml-1" />
        </a>
      </div>

      <div className="text-center overflow-hidden mb-2 bg-white rounded-md relative border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)] p-3 sticky top-[75px]">
        <img src="/Images/ads.png" alt="" className="w-full h-full" />
      </div>
    </div>
  );
};

export default Rightside;