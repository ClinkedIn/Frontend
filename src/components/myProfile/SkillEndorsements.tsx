import React, { useState, useEffect } from "react";
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
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SkillEndorsements: React.FC<SkillEndorsementsProps> = ({
  skillName,
  endorsements = [],
}) => {
  const [endorsersData, setEndorsersData] = useState<UserProfile[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchEndorsers = async () => {
    try {
      const promises = endorsements.map(async (userId) => {
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
      });
      const results = await Promise.all(promises);
      setEndorsersData(results);
    } catch (error) {
      console.error("Error fetching endorsers:", error);
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
          {endorsements.length}{" "}
          {endorsements.length === 1 ? "endorsement" : "endorsements"}
        </button>
      </div>

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
