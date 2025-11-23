import React, { useState, useEffect } from 'react';
import verify from "../assets/verify.png";
import Web3 from 'web3';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const CONTRACT_ADDRESS = '0x316C2435Bb89b3100396E3285b39dDE2D21B4a56';
const CONTRACT_ABI = 

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
      // treat URL with tokenId as NFC/link source
      verifyToken(urlTokenId, 'link');
    }
  }, []);

  // ⬇️ added `source` param
  const verifyToken = async (id, source = 'manual') => {
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
      const res = await axios.get(`http://192.168.161.248:5000/api/product/${id}`);
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

      const resultPayload = { isVerified, owner, manufacturer, product };
      setResult(resultPayload);

      // 🎯 NEW: log scan to backend for analytics
      try {
        // unify "link" as "nfc" in analytics if you want
        const normalizedSource =
          source === 'nfc' || source === 'link' ? 'nfc' : 'manual';

        await axios.post("http://192.168.161.248:5000/api/scan", {
          tokenId: id,
          manufacturer,
          owner,
          isVerified,
          source: normalizedSource, // "nfc" or "manual"
          timestamp: new Date().toISOString(),
        });
      } catch (logErr) {
        console.error("Failed to log scan", logErr);
        // don't block UI if logging fails
      }

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
    // manual entry
    verifyToken(tokenId.trim(), 'manual');
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
              // NFC hardware scan
              verifyToken(id, 'nfc');
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
