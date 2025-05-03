import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { IoMdCloseCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface BlockButtonProps {
  userId: string;
  initialBlocked?: boolean;
  userName?: string;
}

const BlockButton: React.FC<BlockButtonProps> = ({ userId, initialBlocked = false, userName = "this user" }) => {
  const [isBlocked, setIsBlocked] = useState(initialBlocked);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBlock = async () => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/user/block/${userId}`, {}, { withCredentials: true });
      setIsBlocked(true);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/user/block/${userId}`, { withCredentials: true });
      setIsBlocked(false);
      setShowModal(false);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isBlocked ? (
        <button
          className="px-4 py-1.5 border border-red-500 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors flex items-center"
          onClick={handleBlock}
          disabled={loading}
        >
          {loading ? "Blocking..." : (
            <>
              <IoMdCloseCircle className="mr-1 text-lg" />
              Block
            </>
          )}
        </button>
      ) : (
        <>
          <button
            className="px-4 py-1.5 border border-red-500 bg-white text-red-600 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors flex items-center"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <IoMdCloseCircle className="mr-1 text-lg" />
            Blocked
          </button>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
              <div className="bg-white rounded-lg shadow-lg p-0 w-full max-w-sm relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                  <h2 className="text-lg font-semibold">Unblock {userName}</h2>
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
                    Are you sure you want to unblock {userName}? They will be able to interact with you again.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-5 py-2 rounded-full border border-red-600 text-red-600 font-semibold bg-white hover:bg-red-50"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700"
                      onClick={handleUnblock}
                      disabled={loading}
                    >
                      {loading ? "Unblocking..." : "Unblock"}
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

export default BlockButton;