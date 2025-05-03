import React, { useState } from "react";
import { Users } from "lucide-react";
import axios from "axios";
import Form from "./Forms/Form";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface SkillEndorsementsProps {
  skillName: string;
  endorsements?: string[];
  currentUserId: string;
  skillOwnerId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SkillEndorsements: React.FC<SkillEndorsementsProps> = ({
  skillName,
  endorsements = [],
  currentUserId,
  skillOwnerId,
}) => {
  const [endorsersData, setEndorsersData] = useState<UserProfile[]>([]);
  const [localEndorsements, setLocalEndorsements] =
    useState<string[]>(endorsements);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUserId === skillOwnerId;
  const hasEndorsed = localEndorsements.includes(currentUserId);

  const fetchEndorsers = async () => {
    try {
      const profiles = await Promise.all(
        localEndorsements.map(async (userId) => {
          try {
            const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
            const user = res.data.user;
            return {
              _id: userId,
              firstName: user.firstName,
              lastName: user.lastName,
              profilePicture: user.profilePicture,
            };
          } catch {
            return {
              _id: userId,
              firstName: "Unknown",
              lastName: "User",
            };
          }
        })
      );
      setEndorsersData(profiles);
    } catch (err) {
      console.error("Failed to load endorsers", err);
    }
  };

  const handleEndorseOnly = async () => {
    if (!skillOwnerId || !skillName || !currentUserId) {
      setError("Missing skill data.");
      return;
    }

    if (currentUserId === skillOwnerId) {
      setError("You cannot endorse your own skills.");
      return;
    }

    if (hasEndorsed) return;

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/skills/endorsements/add-endorsement`,
        {
          skillOwnerId,
          skillName,
        }
      );
      setLocalEndorsements((prev) => [...prev, currentUserId]);
    } catch (err) {
      setError("Action failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    fetchEndorsers();
    setShowModal(true);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <Users size={16} className="text-gray-500" />
        <button
          onClick={openModal}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          {localEndorsements.length}{" "}
          {localEndorsements.length === 1 ? "endorsement" : "endorsements"}
        </button>
      </div>

      {!isOwnProfile && !hasEndorsed && (
        <button
          onClick={handleEndorseOnly}
          disabled={loading}
          className="mt-2 border rounded-full px-4 py-2 text-sm font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition"
        >
          {loading ? "Processing..." : "Endorse"}
        </button>
      )}

      {!isOwnProfile && hasEndorsed && (
        <p className="mt-2 text-sm text-blue-600 font-medium">
          You endorsed this
        </p>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showModal && (
        <Form title="Endorsers" onClose={() => setShowModal(false)}>
          <div className="p-4 space-y-4">
            {endorsersData.length === 0 ? (
              <p className="text-sm text-gray-500">No endorsements yet.</p>
            ) : (
              endorsersData.map((endorser) => (
                <div key={endorser._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {endorser.profilePicture ? (
                      <img
                        src={endorser.profilePicture}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-semibold">
                        {endorser.firstName.charAt(0)}
                        {endorser.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {endorser.firstName} {endorser.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Endorsed this skill</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Form>
      )}
    </div>
  );
};

export default SkillEndorsements;
