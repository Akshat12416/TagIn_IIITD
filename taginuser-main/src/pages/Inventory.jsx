import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const user = accounts[0];
        setUserAddress(user);

        const res = await axios.get("http://192.168.161.248:5000/api/products");
        const allProducts = res.data;

        const ownedProducts = allProducts.filter(product => product.owner.toLowerCase() === user.toLowerCase());
        setProducts(ownedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 lg:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-black">
            Your Inventory
          </h2>

          <button 
            className="bg-white hover:bg-gray-50 text-black px-6 py-3 rounded-2xl border border-gray-200 transition-all font-medium shadow-md"
            onClick={() => (window.location.href = "http://localhost:5177")}
          >
            Try Sneaker Prediction
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg">No products owned by you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div 
                key={product.tokenId} 
                className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold mb-4 text-black">{product.name}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-black text-sm">Token ID:</span>
                    <span className="text-gray-700 text-sm">{product.tokenId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-black text-sm">Model:</span>
                    <span className="text-gray-700 text-sm">{product.model}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-black text-sm">Serial:</span>
                    <span className="text-gray-700 text-sm">{product.serial}</span>
                  </div>
                </div>

                <button
                  className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl transition-all font-medium"
                  onClick={() => navigate(`/history/${product.tokenId}`)}
                >
                  View Transfer History
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;