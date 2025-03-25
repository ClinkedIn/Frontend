import React from "react";

interface RightsideProps {}

const Rightside: React.FC<RightsideProps>  = (props) => {
  return (
    <div className="grid-area-rightside">
      <div className="text-center overflow-hidden mb-2 bg-white rounded-md relative border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)] p-3">
        <div className="inline-flex items-center justify-between text-[16.5px] w-full">
          <h2 className="text-[#333] font-bold">Add to your feed</h2>
          <img src="/Images/feed-icon.svg" alt="" />
        </div>

        <ul className="mt-4">
          <li className="flex items-center mb-3 text-sm">
            <a href="/feed">
              <div className="bg-[url('https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs')] bg-contain bg-center bg-no-repeat w-[45px] h-[45px] mr-2"></div>
            </a>
            <div className="flex flex-col text-left gap-1">
              <span>#Linkedin</span>
              <button className="bg-transparent text-[rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.6)] py-2 px-4 rounded-full font-semibold flex items-center justify-center max-h-8 max-w-[480px] text-center outline-none text-base transition duration-200 hover:bg-[rgba(0,0,0,0.08)] hover:border-2">
                <img src="/Images/plus-icon.svg" alt="plus" className="mr-1" />
                Follow
              </button>
            </div>
          </li>
          <li className="flex items-center mb-3 text-sm">
            <a href="/feed">
              <div className="bg-[url('https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs')] bg-contain bg-center bg-no-repeat w-[45px] h-[45px] mr-2"></div>
            </a>
            <div className="flex flex-col text-left gap-1">
              <span>#Video</span>
              <button className="bg-transparent text-[rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.6)] py-2 px-4 rounded-full font-semibold flex items-center justify-center max-h-8 max-w-[480px] text-center outline-none text-base transition duration-200 hover:bg-[rgba(0,0,0,0.08)] hover:border-2">
                <img src="/Images/plus-icon.svg" alt="plus" className="mr-1" />
                Follow
              </button>
            </div>
          </li>
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