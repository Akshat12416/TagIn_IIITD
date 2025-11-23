import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserLogin = ({ setUserAddress }) => {
  const [web3, setWeb3] = useState(null);
  const [status, setStatus] = useState("Connect with MetaMask to continue");
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setStatus("🦊 MetaMask not detected. Please install it.");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      setUserAddress(account);
      setStatus("✅ Wallet connected. Redirecting...");
      navigate("/Inventory");
    } catch (err) {
      setStatus(`⚠️ Login failed: ${err.message}`);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-6"
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "linear-gradient(90deg, #f7f7f7 1px, transparent 1px), linear-gradient(180deg, #f7f7f7 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-md w-[400px] flex flex-col items-center space-y-6 border border-gray-200">
        <FaEthereum className="text-gray-800 text-4xl" />
        <h1 className="text-2xl font-semibold text-gray-900">User Login</h1>
        <p className="text-sm text-center text-gray-600">{status}</p>
        <button
          onClick={handleLogin}
          className="bg-gray-800 hover:bg-black text-white font-medium py-2 px-4 rounded-lg transition w-full"
        >
          Connect with MetaMask
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
