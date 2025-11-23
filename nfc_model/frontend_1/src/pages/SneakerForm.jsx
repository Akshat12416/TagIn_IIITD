import React, { useState } from "react";

export default function SneakerForm() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    edition: "",
    size: "",
    color: "",
    horizon: "",
    retail: "",
  });

  const [output, setOutput] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        brand: form.brand,
        model: form.model,
        edition: form.edition,
        size: form.size ? Number(form.size) : 10,
        color: form.color,
        prediction_horizon: form.horizon ? Number(form.horizon) : 1,
        retail: form.retail ? Number(form.retail) : 150,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) setOutput(data);
      else setOutput({ error: data.error || "Failed to get prediction" });
    } catch (err) {
      setOutput({ error: "Failed to connect to the server" });
    }
  };

  // Autofill demo data function
  const autofillDemoData = () => {
    setForm({
      brand: "Nike",
      model: "Air Jordan 1",
      edition: "Retro High",
      size: "10",
      color: "Bred",
      horizon: "30",
      retail: "170",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white border border-gray-200 px-5 py-2 rounded-full text-sm font-semibold mb-4 text-black shadow-md">
            AI-Powered Price Prediction
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-black mb-4">
            Sneaker Resale Price Prediction
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get accurate resale price predictions for your sneakers using advanced machine learning algorithms
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-black">Enter Sneaker Details</h2>
            <button
              type="button"
              onClick={autofillDemoData}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-black rounded-2xl transition-all font-medium shadow-md"
            >
              Try Demo Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={onChange}
                  placeholder="e.g., Nike, Adidas, Jordan"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={onChange}
                  placeholder="e.g., Air Jordan 1, Yeezy 350"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Edition
                </label>
                <input
                  type="text"
                  name="edition"
                  value={form.edition}
                  onChange={onChange}
                  placeholder="e.g., Retro High, V2"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Size (US)
                </label>
                <input
                  type="number"
                  name="size"
                  value={form.size}
                  onChange={onChange}
                  placeholder="e.g., 10.5"
                  step="0.5"
                  min="3"
                  max="18"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Colorway
                </label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={onChange}
                  placeholder="e.g., Bred, Triple White"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Prediction Horizon (days)
                </label>
                <input
                  type="number"
                  name="horizon"
                  value={form.horizon}
                  onChange={onChange}
                  placeholder="e.g., 30"
                  min="1"
                  max="365"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">
                  Retail Price (USD)
                </label>
                <input
                  type="number"
                  name="retail"
                  value={form.retail}
                  onChange={onChange}
                  placeholder="e.g., 170"
                  min="0"
                  step="0.01"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              Get Price Prediction
            </button>
          </form>
        </div>

        {/* Results Card */}
        {output && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">
              {output.error ? '⚠️ Prediction Error' : '✨ Price Prediction Results'}
            </h2>
            
            {output.error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="text-red-700 font-medium text-center">{output.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main Price Display */}
                <div className="text-center bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="text-4xl font-extrabold text-black mb-2">
                    ${output.predicted_price_usd}
                  </div>
                  <div className="text-2xl text-gray-600 mb-4">
                    ₹{output.predicted_price_inr}
                  </div>
                  <div className={`inline-block px-5 py-2 rounded-2xl font-semibold ${
                    output.recommendation === 'Hold/Buy' 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : output.recommendation === 'Sell'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {output.recommendation}
                  </div>
                </div>

                {/* Confidence Interval */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4 text-center">
                    Confidence Interval
                  </h3>
                  <div className="flex justify-center items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Lower Bound</div>
                      <div className="text-xl font-bold text-black">
                        ${output.confidence_interval_usd[0]}
                      </div>
                    </div>
                    <div className="text-gray-400 text-2xl">—</div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Upper Bound</div>
                      <div className="text-xl font-bold text-black">
                        ${output.confidence_interval_usd[1]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    💡 Prediction Insights
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• This prediction is based on historical market data and current trends</p>
                    <p>• Actual resale prices may vary based on condition, rarity, and market demand</p>
                    <p>• Consider market volatility when making buying/selling decisions</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}