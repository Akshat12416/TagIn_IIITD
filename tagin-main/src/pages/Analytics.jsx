import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Shield, AlertTriangle, Activity } from "lucide-react";

const BACKEND_BASE = "http://192.168.161.248:5000";
const MANUFACTURER_ADDRESS = "0x2557C4A84c5bE57dAD9c52F60a9c261141a01CED";

const COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  neutral: "#64748b",
};

const SOURCE_COLORS = ["#0f172a", "#4ade80", "#6366f1"];

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
        fetch(`${BACKEND_BASE}/api/analytics/scan-stats?manufacturer=${MANUFACTURER_ADDRESS}&days=${days}`).then(r => r.json()),
        fetch(`${BACKEND_BASE}/api/analytics/fake-heatmap?manufacturer=${MANUFACTURER_ADDRESS}&days=${days}`).then(r => r.json()),
      ]);

      setStats(statsRes);
      setHeatmap(heatmapRes?.heatmap || []);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error Loading Data</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const scansBySource = stats?.scansBySource || {};
  const last7 = stats?.scansLast7Days || [];
  const topTokens = stats?.topTokens || [];

  // Prepare chart data
  const sourceData = [
    { name: "Manual Entry", value: scansBySource.manual || 0, color: SOURCE_COLORS[0] },
    { name: "NFC Tap", value: scansBySource.nfc || 0, color: SOURCE_COLORS[1] },
    { name: "Direct Link", value: scansBySource.link || 0, color: SOURCE_COLORS[2] },
  ].filter(item => item.value > 0);

  const trendData = last7.map((d) => ({
    date: d.date,
    Total: d.total,
    Verified: d.verified,
    Fake: d.fake,
  }));

  const tokenBarData = topTokens.slice(0, 8).map((t) => ({
    token: `#${t.tokenId.slice(0, 8)}...`,
    scans: t.total,
    fake: t.fake,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Verification Analytics
          </h1>
          <p className="text-gray-600">
            Real-time insights into product authenticity verification
          </p>
        </div>

        {/* Range selector */}
        <div className="flex gap-3 mb-8">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRangeDays(d)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                rangeDays === d
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/50 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Total Scans"
            value={formatNumber(stats.totalScans)}
            color="indigo"
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            label="Verified Scans"
            value={formatNumber(stats.verifiedScans)}
            color="green"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Fake Scans"
            value={formatNumber(stats.fakeScans)}
            color="red"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Verification Rate"
            value={`${stats.verificationRate.toFixed(1)}%`}
            color="blue"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Trend Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Scan Activity Trend
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Daily breakdown over the last 7 days
            </p>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Total"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.primary, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Verified"
                    stroke={COLORS.success}
                    strokeWidth={3}
                    dot={{ fill: COLORS.success, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Fake"
                    stroke={COLORS.danger}
                    strokeWidth={3}
                    dot={{ fill: COLORS.danger, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No activity data available</p>
            )}
          </div>

          {/* Pie Chart - Scans by Source */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Scans by Source
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              How users verify products
            </p>
            {sourceData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {sourceData.map((item, idx) => {
                    const percent = stats.totalScans > 0
                      ? Math.round((item.value / stats.totalScans) * 100)
                      : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {percent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-20">No source data available</p>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Top Tokens */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Most Scanned Products
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Token IDs with highest activity
            </p>
            {tokenBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tokenBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="token"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="scans" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="fake" fill={COLORS.danger} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No token data available</p>
            )}
          </div>

          {/* Fake Scan Hotspots */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Fake Scan Hotspots
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Cities with the most mismatches
            </p>
            {heatmap.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {heatmap
                  .slice()
                  .sort((a, b) => b.fakeScans - a.fakeScans)
                  .map((cityInfo, idx) => {
                    const maxFake = Math.max(...heatmap.map(c => c.fakeScans));
                    const widthPercent = (cityInfo.fakeScans / maxFake) * 100;
                    return (
                      <div key={idx} className="relative">
                        <div className="flex items-center justify-between mb-1.5 relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-medium text-gray-800">
                              {cityInfo.city}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {cityInfo.fakeScans}
                          </span>
                        </div>
                        <div className="w-full bg-red-50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  No city-level data yet. Start sending location data to see hotspots.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-emerald-500 to-emerald-600",
    red: "from-rose-500 to-rose-600",
    blue: "from-blue-500 to-blue-600",
  };

  const bgColors = {
    indigo: "bg-indigo-50",
    green: "bg-emerald-50",
    red: "bg-rose-50",
    blue: "bg-blue-50",
  };

  const iconColors = {
    indigo: "text-indigo-600",
    green: "text-emerald-600",
    red: "text-rose-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColors[color]} p-3 rounded-xl ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

export default Analytics;