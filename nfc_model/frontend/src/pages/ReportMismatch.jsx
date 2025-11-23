import React, { useState } from "react";
import UploadImage from "../components/UploadImage";
import axios from "axios";

const ReportMismatch = () => {
  const [brand, setBrand] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // NEW STATE

  // Capture browser geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          setMessage(`Location captured: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setMessage("Could not get location. Please allow geolocation.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation not supported");
      setMessage("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoFile || !brand) {
      setMessage("Please upload photo and select brand");
      return;
    }

    setLoading(true);
    setMessage("");

    const token_metadata = {
      product_name: "Campus Shoes",
      serial_no: "CAMP1234",
      model_no: "CMP-2025",
      type: "shoes",
      color: "black",
      manufactured: "2025-09-26",
      manufacturer: "Campus Pvt Ltd",
    };

    const formData = new FormData();
    formData.append("photo", photoFile);
    formData.append("reported_brand", brand);
    formData.append("lat", lat);
    formData.append("lon", lon);
    formData.append("token_metadata", JSON.stringify(token_metadata));

    try {
      const res = await axios.post("http://localhost:5002/api/report_mismatch", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });

      setMessage(
        res.data.message
          ? `${res.data.message} (Label: ${res.data.final_label}, City: ${res.data.city})`
          : "Report submitted successfully"
      );

      // Show popup only when success
      setShowPopup(true);

    } catch (err) {
      console.error("Error submitting report:", err);

      if (err.response) {
        setMessage(`Backend Error: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        setMessage("No response from server. Check if backend is running on port 5000.");
      } else {
        setMessage(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "linear-gradient(90deg, #f7f7f7 1px, transparent 1px), linear-gradient(180deg, #f7f7f7 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        
        {/* --- POPUP MODAL --- */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Report Submitted</h3>
              <p className="text-gray-700 mb-6">Thank you for helping us fight counterfeits!</p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-red-200">
            Report Product Mismatch
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Help Us Fight Counterfeits
          </h2>
          <p className="text-gray-600 text-lg">
            Report suspected counterfeit products to protect other consumers
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Image Section */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <UploadImage setPhotoFile={setPhotoFile} />
            {photoFile && (
              <div className="mt-3 text-sm text-green-600 font-medium">
                ✓ Photo selected: {photoFile.name}
              </div>
            )}
          </div>
          
          {/* Brand Input */}
          <div>
            <label htmlFor="brand" className="block text-lg font-semibold text-gray-900 mb-3">
              Reported Brand Name
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg"
              placeholder="Enter the brand name on the product"
              required
            />
          </div>

          {/* Location Section */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                <p className="text-gray-600 text-sm">Help us track counterfeit hotspots</p>
              </div>
              <button
                type="button"
                onClick={getLocation}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                📍 Capture Location
              </button>
            </div>
            
            {lat && lon && (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-green-600 font-medium">
                  ✓ Location captured: {lat.toFixed(6)}, {lon.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
              loading 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-red-600 text-white hover:bg-red-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Submitting Report...
              </div>
            ) : (
              " Submit Mismatch Report"
            )}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How it works</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Upload a photo of the suspected counterfeit product</p>
            <p>• Enter the brand name as it appears on the product</p>
            <p>• Share your location to help identify counterfeit hotspots</p>
            <p>• Our AI will analyze the product and verify authenticity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportMismatch;
