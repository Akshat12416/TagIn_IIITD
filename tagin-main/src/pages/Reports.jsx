import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/get_reports"); // we will add this backend route
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Could not fetch reports from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Product Reports</h1>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reports.length === 0 && <p>No reports found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-2xl shadow-md p-4 border border-gray-200"
          >
            {r.photo_filename && (
              <img
                src={`http://localhost:5002/uploads/${r.photo_filename}`}
                alt={r.reported_brand}
                className="w-full h-48 object-cover rounded-lg mb-3"
            />
            )}
            <p>
              <strong>Brand:</strong> {r.reported_brand}
            </p>
            <p>
              <strong>Label:</strong>{" "}
              <span
                className={
                  r.final_label === "confirmed_mismatch"
                    ? "text-red-600 font-semibold"
                    : r.final_label === "verified"
                    ? "text-green-600 font-semibold"
                    : "text-yellow-600 font-semibold"
                }
              >
                {r.final_label}
              </span>
            </p>
            <p>
              <strong>City:</strong> {r.city}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
