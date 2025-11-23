import React, { useState, useEffect } from 'react';
import verify from "../assets/verify.png";
import Web3 from 'web3';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const CONTRACT_ADDRESS = '0x316C2435Bb89b3100396E3285b39dDE2D21B4a56';
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "metadataHash",
                "type": "bytes32"
            }
        ],
        "name": "mintProduct",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            }
        ],
        "name": "ProductMinted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "removeFromWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isWhitelisted",
                "type": "bool"
            }
        ],
        "name": "WhitelistUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getProductDetails",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "products",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "metadataHash",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whitelist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

function VerifyProduct() {
  const [tokenId, setTokenId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlTokenId = searchParams.get('tokenId');
    if (urlTokenId) {
      setTokenId(urlTokenId);
      verifyToken(urlTokenId);
    }
  }, []);

  const verifyToken = async (id) => {
    setResult(null);
    setError('');
    setLoading(true);

    try {
      if (!id || isNaN(id)) {
        setError("Invalid Token ID.");
        setLoading(false);
        return;
      }

      // ✅ Use Infura for read-only verification
      const infuraWeb3 = new Web3('https://sepolia.infura.io/v3/dcef80d47f6e40e6a8ee736c8ed444e2');
      const contract = new infuraWeb3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      // Always send string to avoid BigInt issues
      const blockchainResult = await contract.methods.getProductDetails(id.toString()).call();

      const blockchainMetadataHash = blockchainResult[0];
      const manufacturer = blockchainResult[1];
      const owner = blockchainResult[2];

      // ✅ Backend data
      const res = await axios.get(`http://192.168.0.138:5000/api/product/${id}`);
      const product = res.data;

      const metadataString = JSON.stringify({
        name: product.name,
        serial: product.serial,
        model: product.model,
        type: product.type,
        color: product.color,
        date: product.date
      });

      const localHash = SHA256(metadataString).toString();
      const isVerified = "0x" + localHash === blockchainMetadataHash;

      setResult({ isVerified, owner, manufacturer, product });

      if (isVerified) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!tokenId.trim()) {
      setError("Please enter a valid Token ID.");
      return;
    }
    verifyToken(tokenId.trim());
  };

  const handleNFCScan = async () => {
    setError('');
    try {
      if (!('NDEFReader' in window)) {
        setError("NFC not supported on this device/browser.");
        return;
      }

      const ndef = new window.NDEFReader();
      await ndef.scan();

      ndef.onreading = (event) => {
        for (const record of event.message.records) {
          if (record.recordType === "text") {
            const text = new TextDecoder().decode(record.data);
            const id = text.match(/\d+/)?.[0];
            if (id) {
              setTokenId(id);
              verifyToken(id);
            } else {
              setError("No valid token ID found in NFC data.");
            }
          }
        }
      };
    } catch (err) {
      console.error(err);
      setError("NFC Scan failed: " + err.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide mb-8 text-black text-center">
        Verify Product Authenticity
      </h1>

      {/* Main card */}
      <div className="w-full max-w-4xl rounded-3xl border border-gray-200 shadow-xl p-6 md:p-10 bg-white">
        <div className="flex flex-col md:flex-row items-center">
          <img
            src={verify}
            alt="verify"
            className="w-32 sm:w-40 md:w-56 mb-6 md:mb-0 md:mr-10"
          />

          <div className="w-full">
            <label className="block text-base sm:text-lg font-semibold mb-3 text-black">
              Enter Token ID:
            </label>
            <div className="w-full flex flex-col md:flex-row items-center gap-3 mb-4">
              <input
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="e.g. 1"
                type="text"
                className="flex-1 w-full md:w-auto px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
              <button
                onClick={handleVerify}
                className="flex-1 md:flex-none px-6 py-3 bg-black hover:bg-gray-900 text-white rounded-2xl shadow-xl transition-all font-medium"
                style={{ minWidth: "140px" }}
              >
                Verify
              </button>
              <button
                onClick={handleNFCScan}
                className="flex-1 md:flex-none px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-black rounded-2xl transition-all font-medium"
                style={{ minWidth: "140px" }}
              >
                Scan NFC Tag
              </button>
            </div>

            {error && (
              <p className="text-red-500 mt-2 font-medium text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="mt-8 text-black text-lg sm:text-xl font-semibold animate-pulse text-center">
          ⏳ Verifying...
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="mt-10 w-full max-w-4xl rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 bg-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-black tracking-wide">
            {result.isVerified ? ' Product Verified' : ' Product Verification Failed'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Product Name:</span>
              <p className="mt-1">{result.product.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Serial No:</span>
              <p className="mt-1">{result.product.serial}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Model No:</span>
              <p className="mt-1">{result.product.model}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Type:</span>
              <p className="mt-1">{result.product.type}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Color:</span>
              <p className="mt-1">{result.product.color}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Manufactured:</span>
              <p className="mt-1">{result.product.date}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Manufacturer:</span>
              <p className="mt-1 text-xs font-mono break-all">{result.manufacturer}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="font-semibold text-black">Current Owner:</span>
              <p className="mt-1 text-xs font-mono break-all">{result.owner}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/login?redirect=history/${tokenId}`)}
              className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl transition-all font-medium w-full sm:w-auto"
            >
              View Transfer History
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl transition-all font-medium w-full sm:w-auto"
              onClick={() => (window.location.href = "http://localhost:3000")}
            >
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyProduct;