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

      const web3 = new Web3(window.ethereum || 'https://sepolia.infura.io/v3/e3a902aedc984173971f927de0fca014');
      const tokenIdBN = BigInt(id);

      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const blockchainResult = await contract.methods.getProductDetails(tokenIdBN).call();

      const blockchainMetadataHash = blockchainResult[0];
      const manufacturer = blockchainResult[1];
      const owner = blockchainResult[2];

      const res = await axios.get(`http://172.20.10.7:5000/api/product/${id}`);
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
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 text-gray-900 px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 text-center">Verify Product Authenticity</h1>

      <div className="relative w-full max-w-4xl rounded-3xl p-[4px] bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 animate-glow">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center">
          <img src={verify} alt="verify" className="w-40 sm:w-56 mb-4 md:mb-0 md:mr-10" />

          <div className="w-full">
            <label className="block text-lg font-semibold mb-2">Enter Token ID:</label>
            <input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder='e.g. 1'
              type='text'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleVerify}
                className='bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition shadow-md'
              >
                Verify
              </button>
              <button
                onClick={handleNFCScan}
                className='bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition shadow-md'
              >
                Scan NFC Tag
              </button>
            </div>

            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
          </div>
        </div>
      </div>

      {loading && (
        <div className='mt-6 text-purple-700 text-xl font-medium animate-pulse'>
          ⏳ Verifying...
        </div>
      )}

      {result && (
        <div className="relative mt-10 w-full max-w-4xl rounded-3xl p-[4px] bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 animate-glow">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl p-6">
            <h2 className='text-2xl font-semibold mb-4 text-center'>
              {result.isVerified ? '✅ Product Verified' : '❌ Product Verification Failed'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div><strong>Product Name:</strong> {result.product.name}</div>
              <div><strong>Serial No:</strong> {result.product.serial}</div>
              <div><strong>Model No:</strong> {result.product.model}</div>
              <div><strong>Type:</strong> {result.product.type}</div>
              <div><strong>Color:</strong> {result.product.color}</div>
              <div><strong>Manufactured:</strong> {result.product.date}</div>
              <div><strong>Manufacturer:</strong> {result.manufacturer}</div>
              <div><strong>Current Owner:</strong> {result.owner}</div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(`/login?redirect=history/${tokenId}`)}
                className='bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition shadow-md'
              >
                View Transfer History
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes glow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-glow {
          background-size: 200% 200%;
          animation: glow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default VerifyProduct;
