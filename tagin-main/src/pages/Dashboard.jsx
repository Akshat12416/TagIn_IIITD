import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.161.248:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full bg-black min-h-screen">

      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease-out backwards;
        }

        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.15s; }
        .stagger-3 { animation-delay: 0.2s; }
        .stagger-4 { animation-delay: 0.25s; }
        .stagger-5 { animation-delay: 0.3s; }
        .stagger-6 { animation-delay: 0.35s; }
      `}</style>

      <section className="w-full bg-white">
        <div className="w-full max-w-8xl mx-auto px-6 md:px-12 lg:px-20 xl:px-16">
          <div className="pt-20 md:pt-32 pb-12 md:pb-16 lg:pb-20">
            
            {/* Header Title */}
            <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
              <h1 className="font-semibold text-black text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Manufacturer Dashboard
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-4 max-w-2xl mx-auto">
                View and manage all authenticated products with blockchain-verified records
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 md:py-32">
                <div className="w-16 h-16 border-4 border-neutral-200 border-t-black rounded-full animate-spin-custom"></div>
                <p className="mt-6 text-gray-500 font-medium text-base md:text-lg">Loading products...</p>
              </div>
            ) : (
              <div className="bg-neutral-100 rounded-2xl border border-gray-200 p-6 md:p-8 animate-fade-in-up">
                <div className="overflow-x-auto rounded-xl">
                  <table className="w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="animate-fade-in-up">
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider first:rounded-tl-xl">
                          Product Name
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Serial Number
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Model Number
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Type
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Color
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Manufacture Date
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Token ID
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Metadata Hash
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Manufacturer
                        </th>
                        <th className="bg-black text-white px-4 py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wider last:rounded-tr-xl">
                          Owner
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr
                          key={i}
                          className={`animate-slide-in stagger-${Math.min(i + 1, 6)} bg-white border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg`}
                        >
                          <td className="px-4 py-4 text-sm text-black font-medium transition-colors duration-200">
                            {p.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 transition-colors duration-200">
                            {p.serial}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 transition-colors duration-200">
                            {p.model}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 transition-colors duration-200">
                            {p.type}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 transition-colors duration-200">
                            {p.color}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 transition-colors duration-200">
                            {p.date}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 transition-colors duration-200">
                            {p.tokenId}
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-500 font-mono break-all max-w-[150px] transition-colors duration-200">
                            {p.metadataHash}
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-500 font-mono break-all max-w-[150px] transition-colors duration-200">
                            {p.manufacturer}
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-500 font-mono break-all max-w-[150px] transition-colors duration-200">
                            {p.owner}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <footer className="w-full bg-black text-white border-t border-gray-800">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 xl:px-32 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Manufacturer Dashboard. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}