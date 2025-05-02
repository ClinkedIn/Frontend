import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";

interface Endorser {
  userId: string;
  name: string;
  profilePicture?: string;
}

interface SkillEndorsementsProps {
  skillName: string;
  endorsements?: string[] | Endorser[];
  onEndorse?: (skillName: string, skillOwnerId: string) => Promise<boolean>;
  onRemoveEndorse?: (
    skillName: string,
    skillOwnerId: string
  ) => Promise<boolean>;
  currentUserId: string;
  skillOwnerId: string;
}

const SkillEndorsements: React.FC<SkillEndorsementsProps> = ({
  skillName,
  endorsements = [],
  onEndorse,
  onRemoveEndorse,
  currentUserId,
  skillOwnerId,
}) => {
  const [showEndorsements, setShowEndorsements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the current user is viewing their own profile
  const isOwnProfile = currentUserId === skillOwnerId;

  // Check if current user has already endorsed this skill
  const hasEndorsed =
    Array.isArray(endorsements) &&
    endorsements.some((endorsement) =>
      typeof endorsement === "string"
        ? endorsement === currentUserId
        : endorsement.userId === currentUserId
    );

  const endorsementCount = Array.isArray(endorsements)
    ? endorsements.length
    : 0;

  const handleEndorse = async () => {
    if (isOwnProfile) {
      setError("You cannot endorse your own skills");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!onEndorse || !onRemoveEndorse) {
      setError("Endorsement functionality is not available");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (hasEndorsed) {
        await onRemoveEndorse(skillName, skillOwnerId);
      } else {
        await onEndorse(skillName, skillOwnerId);
      }
    } catch (err: any) {
      setError(err.message || "Error processing endorsement");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEndorsements = () => {
    setShowEndorsements(!showEndorsements);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center">
        <Users size={16} className="text-gray-500 mr-1" />

        <button
          onClick={toggleEndorsements}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          {endorsementCount}{" "}
          {endorsementCount === 1 ? "endorsement" : "endorsements"}
        </button>
      </div>

      {/* Only show endorse button when viewing someone else's profile */}
      {!isOwnProfile && onEndorse && onRemoveEndorse && (
        <button
          onClick={handleEndorse}
          disabled={isLoading}
          className={`mt-2 border rounded-full px-4 py-2 text-sm font-medium ${
            hasEndorsed
              ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {isLoading ? "Processing..." : hasEndorsed ? "Endorsed" : "Endorse"}
        </button>
      )}

      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

      {showEndorsements && endorsementCount > 0 && (
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white">
          <h4 className="font-medium text-gray-700 mb-2">Endorsements</h4>
          <div className="space-y-2">
            {endorsements.map((endorsement, index) => {
              // Handle both string IDs and Endorser objects
              const isEndorserObject = typeof endorsement !== "string";
              const endorserId = isEndorserObject
                ? endorsement.userId
                : endorsement;
              const endorserName = isEndorserObject
                ? endorsement.name
                : `Endorser ${index + 1}`;
              const endorserPicture = isEndorserObject
                ? endorsement.profilePicture
                : undefined;

              return (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 overflow-hidden">
                    {endorserPicture ? (
                      <img
                        src={endorserPicture}
                        alt={endorserName}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{endorserName}</p>
                    <p className="text-xs text-gray-500">
                      {endorserId.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillEndorsements;
