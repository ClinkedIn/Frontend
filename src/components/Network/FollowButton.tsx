import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface FollowButtonProps {
  userId: string;
  initialFollowed?: boolean;
  userName?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowed = false,
  userName = "this user",
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowed);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      setIsFollowing(true);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/user/follow/${userId}`, {
        withCredentials: true,
      });
      setIsFollowing(false);
      setShowModal(false);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isFollowing ? (
        <button
          className="px-4 py-1.5 border border-blue-500 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center"
          onClick={handleFollow}
          disabled={loading}
        >
          {loading ? (
            "Following..."
          ) : (
            <>
              <span className="mr-1 text-lg font-bold">+</span>Follow
            </>
          )}
        </button>
      ) : (
        <>
          <button
            className="px-4 py-1.5 border border-[#0073b1] bg-white text-[#0073b1] rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <IoMdCheckmark className="mr-1 text-lg" />
            Following
          </button>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
              <div className="bg-white rounded-lg shadow-lg p-0 w-full max-w-sm relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                  <h2 className="text-lg font-semibold">Unfollow {userName}</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    <IoClose />
                  </button>
                </div>
                {/* Modal Body */}
                <div className="px-6 pb-6">
                  <p className="mb-8 text-gray-700">
                    Stop seeing posts from {userName} on your feed. {userName}{" "}
                    won’t be notified that you’ve unfollowed.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-5 py-2 rounded-full border border-[#0073b1] text-[#0073b1] font-semibold bg-white hover:bg-blue-50"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 rounded-full bg-[#0073b1] text-white font-semibold hover:bg-blue-700"
                      onClick={handleUnfollow}
                      disabled={loading}
                    >
                      {loading ? "Unfollowing..." : "Unfollow"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FollowButton;
