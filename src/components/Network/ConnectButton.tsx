import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { IoMdPersonAdd } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io"; // "Not allowed" icon

interface ConnectButtonProps {
  userId: string;
  onConnect?: () => void;
  connectionRequestPrivacy?: "everyone" | "mutual";
  isMutual?: boolean;
}

type ButtonState = "connect" | "pending" | "connected" | "error";

const ConnectButton: React.FC<ConnectButtonProps> = ({
  userId,
  onConnect,
  connectionRequestPrivacy = "everyone",
  isMutual = false,
}) => {
  const [state, setState] = useState<ButtonState>("connect");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRestrictedByPrivacy =
    connectionRequestPrivacy === "mutual" && !isMutual;

  const handleConnect = async () => {
    if (state !== "connect" || loading || isRestrictedByPrivacy) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/connections/request/${userId}`
      );
      console.log("Connection request sent:", response.data);

      setState("pending");
      if (onConnect) onConnect();
    } catch (error:any) {
      console.error("Error sending connection request:", error.response || error.message);
      setErrorMessage("Failed to send connection request");
      setState("error");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (isRestrictedByPrivacy) return "Connect (Restricted)";
    switch (state) {
      case "connect":
        return "Connect";
      case "pending":
        return "Pending";
      case "connected":
        return "Connected";
      case "error":
        return "Error";
      default:
        return "Connect";
    }
  };

  return (
    <button
      className={`px-4 py-1.5 mx-2 flex items-center justify-center gap-2 border rounded-full text-sm font-semibold transition-colors
        ${
          isRestrictedByPrivacy
            ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
            : state === "connect"
            ? "border-[#0073b1] text-[#0073b1] hover:bg-[#EAF4FD]"
            : state === "pending"
            ? "border-gray-400 text-gray-500 bg-gray-100 cursor-not-allowed"
            : state === "connected"
            ? "border-green-500 text-green-600 bg-green-50 cursor-default"
            : state === "error"
            ? "border-red-500 text-red-600 hover:bg-red-50"
            : "border-blue-500 text-blue-600 hover:bg-blue-50"
        }
      `}
      onClick={handleConnect}
      disabled={loading || state !== "connect" || isRestrictedByPrivacy}
      title={
        isRestrictedByPrivacy
          ? "Only mutual connections can send requests"
          : undefined
      }
    >
      {loading ? (
        "Sending..."
      ) : (
        <>
          {isRestrictedByPrivacy ? (
            <IoMdCloseCircleOutline className="text-lg" />
          ) : (
            <IoMdPersonAdd className="text-lg" />
          )}
          {getButtonText()}
        </>
      )}
    </button>
  );
};

export default ConnectButton;
