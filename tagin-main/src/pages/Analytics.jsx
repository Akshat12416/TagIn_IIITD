import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_BASE = "http://192.168.161.248:5000"; // adjust if needed

// 👇 your manufacturer address used on-chain
const MANUFACTURER_ADDRESS =
  "0x2557C4A84c5bE57dAD9c52F60a9c261141a01CED";

const Analytics = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (days) => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, heatmapRes] = await Promise.all([
        axios.get(`${BACKEND_BASE}/api/analytics/scan-stats`, {
          params: { manufacturer: MANUFACTURER_ADDRESS, days },
        }),
        axios.get(`${BACKEND_BASE}/api/analytics/fake-heatmap`, {
          params: { manufacturer: MANUFACTURER_ADDRESS, days },
        }),
      ]);

      setStats(statsRes.data);
      setHeatmap(heatmapRes.data?.heatmap || []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics. Check backend /api/analytics/* endpoints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(rangeDays);
  }, [rangeDays]);

  const formatNumber = (n) =>
    typeof n === "number" ? n.toLocaleString() : n || 0;

  const scansBySource = stats?.scansBySource || {};
  const last7 = stats?.scansLast7Days || [];
  const topTokens = stats?.topTokens || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Verification Analytics
      </h1>

      {/* Range selector */}
      <div className="flex gap-2 mb-6">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setRangeDays(d)}
            className={`px-4 py-2 rounded-full text-sm border transition-all ${
              rangeDays === d
                ? "bg-black text-white shadow-sm"
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            Last {d} days
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-gray-600 text-lg">Loading analytics...</div>
      )}

      {error && !loading && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && stats && (
        <div className="space-y-8">
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Scans" value={stats.totalScans} />
            <StatCard
              label="Verified Scans"
              value={stats.verifiedScans}
              accent="green"
            />
            <StatCard
              label="Fake / Mismatch Scans"
              value={stats.fakeScans}
              accent="red"
            />
            <StatCard
              label="Verification Rate"
              value={`${stats.verificationRate.toFixed(1)}%`}
            />
          </div>

          {/* Sources + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scans by source */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Scans by Source
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                How users are verifying your products
              </p>

              {["manual", "nfc", "link"].map((key) => {
                const labelMap = {
                  manual: "Manual (typed token)",
                  nfc: "NFC Tap",
                  link: "Direct Link (NFC/QR)",
                };
                const value = scansBySource[key] || 0;
                const percent =
                  stats.totalScans > 0
                    ? Math.round((value / stats.totalScans) * 100)
                    : 0;

                return (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{labelMap[key]}</span>
                      <span className="text-gray-900 font-medium">
                        {formatNumber(value)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percent}%`,
                          background:
                            key === "nfc"
                              ? "#4ade80"
                              : key === "link"
                              ? "#6366f1"
                              : "#0f172a",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Last 7 days table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Activity (Last 7 Days)
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Daily breakdown of total vs fake scans
              </p>

              {last7.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No scan activity recorded yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Total</th>
                        <th className="py-2 pr-4">Verified</th>
                        <th className="py-2 pr-4">Fake</th>
                      </tr>
                    </thead>
                    <tbody>
                      {last7.map((d, idx) => (
                        <tr key={idx} className="border-b border-gray-50">
                          <td className="py-2 pr-4 text-gray-700">
                            {d.date}
                          </td>
                          <td className="py-2 pr-4 text-gray-900 font-medium">
                            {formatNumber(d.total)}
                          </td>
                          <td className="py-2 pr-4 text-emerald-600">
                            {formatNumber(d.verified)}
                          </td>
                          <td className="py-2 pr-4 text-rose-600">
                            {formatNumber(d.fake)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Top tokens + heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top tokens */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Most Scanned Products
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Token IDs with highest scan activity
              </p>

              {topTokens.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No scan data yet for this range.
                </p>
              ) : (
                <ul className="space-y-2 text-sm text-gray-700">
                  {topTokens.map((t) => (
                    <li
                      key={t.tokenId}
                      className="flex justify-between border-b border-gray-100 pb-1"
                    >
                      <span className="font-mono text-xs break-all">
                        #{t.tokenId}
                      </span>
                      <span className="text-gray-500">
                        {t.total} scans • {t.fake} fake
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Fake heatmap list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Fake Scan Hotspots
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Cities with the most mismatches (requires you to send city data later)
              </p>

              {heatmap.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No city-level data yet. Start sending city for scans to see this fill up.
                </p>
              ) : (
                <ul className="space-y-2">
                  {heatmap
                    .slice()
                    .sort((a, b) => b.fakeScans - a.fakeScans)
                    .map((cityInfo, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="font-medium text-gray-800">
                            {cityInfo.city}
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {cityInfo.fakeScans} fake scans
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, accent }) => {
  const accentClass =
    accent === "green"
      ? "text-emerald-600"
      : accent === "red"
      ? "text-rose-600"
      : "text-gray-900";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="text-xs uppercase text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${accentClass}`}>{value}</div>
    </div>
  );
};

export default Analytics;
