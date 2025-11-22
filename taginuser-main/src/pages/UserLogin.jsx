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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-300 to-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] flex flex-col items-center space-y-6">
        <FaEthereum className="text-purple-500 text-4xl" />
        <h1 className="text-2xl font-semibold text-gray-800">User Login</h1>
        <p className="text-sm text-center text-gray-600">{status}</p>
        <button
          onClick={handleLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Connect with MetaMask
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
