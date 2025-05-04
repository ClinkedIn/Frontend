import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { IoMdPersonAdd } from "react-icons/io";

interface ConnectButtonProps {
  userId: string;
  onConnect?: () => void;
}

type ButtonState = "connect" | "pending" | "connected" | "error";

const ConnectButton: React.FC<ConnectButtonProps> = ({ userId, onConnect }) => {
  const [state, setState] = useState<ButtonState>("connect");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    if (state !== "connect" || loading) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/connections/request/${userId}`
      );
      console.log("Connection request sent:", response.data);

      // Change state to pending
      setState("pending");
      if (onConnect) onConnect(); // Trigger optional callback
    } catch (error) {
      console.error("Error sending connection request:", error);
      setErrorMessage("Failed to send connection request");
      setState("error");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
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
      className={`px-4 py-1.5 mx-2 cursor-pointer border rounded-full text-sm font-semibold transition-colors
      ${
        state === "connect"
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
      disabled={state !== "connect" || loading}
    >
      {state === "connect" && !loading && (
        <IoMdPersonAdd className="inline-block mr-2 text-lg" />
      )}
      {loading ? "Sending..." : getButtonText()}
    </button>
  );
};

export default ConnectButton;
